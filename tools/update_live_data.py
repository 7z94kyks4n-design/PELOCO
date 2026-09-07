#!/usr/bin/env python3
"""Build the public, timestamped PELOCO on-chain data snapshot."""

from __future__ import annotations

import json
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "data" / "live.json"
HISTORY = ROOT / "data" / "history.json"
MINT = "HprAo1GwX5ezFSp7yaYTeAhkj5pCjXVgs2mwRXjqpump"
DECLARED_WALLETS = [
    "FG7w73eqj4VaB4Yxj8KmBrUuSin4jv9vhxhmeqdaFZj2",
    "BGAmHnySzhRd25ikw7Xpgf2P3DJuHJhaU79tuucgkTmG",
    "2BvMhRQS3bghmgJav8sbnGXfh1UqcKwrJPTPAaRSHrEk",
]
TOKEN_2022 = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
SOLANA_RPC = "https://api.mainnet-beta.solana.com"
DEX_API = f"https://api.dexscreener.com/token-pairs/v1/solana/{MINT}"
PUMP_API = f"https://frontend-api-v3.pump.fun/coins/{MINT}"


def request_json(url: str, payload: dict | None = None) -> dict | list:
    body = json.dumps(payload).encode() if payload is not None else None
    request = Request(
        url,
        data=body,
        headers={"Content-Type": "application/json", "User-Agent": "PELOCO-public-data/1.0"},
    )
    with urlopen(request, timeout=30) as response:
        return json.load(response)


def rpc(method: str, params: list) -> dict:
    response = request_json(
        SOLANA_RPC,
        {"jsonrpc": "2.0", "id": 1, "method": method, "params": params},
    )
    if not isinstance(response, dict) or response.get("error"):
        raise RuntimeError(f"Solana RPC {method} failed: {response}")
    return response["result"]


def on_chain_data() -> dict:
    mint_result = rpc("getAccountInfo", [MINT, {"encoding": "jsonParsed", "commitment": "confirmed"}])
    mint_value = mint_result.get("value") or {}
    parsed = (((mint_value.get("data") or {}).get("parsed") or {}).get("info") or {})

    accounts = rpc(
        "getProgramAccounts",
        [
            TOKEN_2022,
            {
                "commitment": "confirmed",
                "encoding": "jsonParsed",
                "filters": [{"memcmp": {"offset": 0, "bytes": MINT}}],
            },
        ],
    )
    positive = []
    balances_by_owner: dict[str, int] = {}
    for account in accounts:
        info = (((account.get("account") or {}).get("data") or {}).get("parsed") or {}).get("info") or {}
        amount = int(((info.get("tokenAmount") or {}).get("amount") or "0"))
        owner = info.get("owner")
        if amount > 0 and owner:
            positive.append(owner)
            balances_by_owner[owner] = balances_by_owner.get(owner, 0) + amount

    decimals = int(parsed.get("decimals", 0))
    supply_raw = int(parsed.get("supply", "0"))
    declared = []
    for wallet in DECLARED_WALLETS:
        raw = balances_by_owner.get(wallet, 0)
        declared.append(
            {
                "address": wallet,
                "balanceRaw": str(raw),
                "balance": raw / (10**decimals),
                "sharePercent": (raw / supply_raw * 100) if supply_raw else None,
            }
        )
    declared_raw = sum(int(item["balanceRaw"]) for item in declared)
    return {
        "slot": mint_result.get("context", {}).get("slot"),
        "program": (mint_value.get("data") or {}).get("program"),
        "mintAuthority": parsed.get("mintAuthority"),
        "freezeAuthority": parsed.get("freezeAuthority"),
        "decimals": decimals,
        "supplyRaw": str(supply_raw),
        "totalSupply": supply_raw / (10**decimals) if decimals >= 0 else None,
        "positiveTokenAccounts": len(positive),
        "uniquePositiveOwners": len(set(positive)),
        "declaredWallets": declared,
        "declaredAggregate": {
            "balanceRaw": str(declared_raw),
            "balance": declared_raw / (10**decimals),
            "sharePercent": (declared_raw / supply_raw * 100) if supply_raw else None,
        },
    }


def market_data() -> dict | None:
    try:
        pairs = request_json(DEX_API)
    except Exception:
        return None
    if not isinstance(pairs, list):
        return None
    exact = [
        pair
        for pair in pairs
        if pair.get("chainId") == "solana"
        and MINT in {
            (pair.get("baseToken") or {}).get("address"),
            (pair.get("quoteToken") or {}).get("address"),
        }
        and float(pair.get("priceUsd") or 0) > 0
    ]
    if not exact:
        return None
    pair = max(
        exact,
        key=lambda item: (
            float((item.get("liquidity") or {}).get("usd") or 0),
            float((item.get("volume") or {}).get("h24") or 0),
        ),
    )
    return {
        "pairAddress": pair.get("pairAddress"),
        "dexId": pair.get("dexId"),
        "priceUsd": pair.get("priceUsd"),
        "marketCap": pair.get("marketCap"),
        "fdv": pair.get("fdv"),
        "liquidityUsd": (pair.get("liquidity") or {}).get("usd"),
        "volume24h": (pair.get("volume") or {}).get("h24"),
        "change24h": (pair.get("priceChange") or {}).get("h24"),
    }


def pump_fun_data() -> dict | None:
    request = Request(
        PUMP_API,
        headers={
            "Accept": "application/json",
            "Origin": "https://pump.fun",
            "Referer": "https://pump.fun/",
            "User-Agent": "Mozilla/5.0 PELOCO-public-data/1.0",
        },
    )
    try:
        with urlopen(request, timeout=30) as response:
            coin = json.load(response)
    except Exception:
        return None
    if not isinstance(coin, dict) or coin.get("mint") != MINT:
        return None
    return {
        "creatorAddress": coin.get("creator"),
        "bondingCurve": coin.get("bonding_curve"),
        "associatedBondingCurve": coin.get("associated_bonding_curve"),
        "migrationComplete": bool(coin.get("complete")),
        "raydiumPool": coin.get("raydium_pool"),
        "marketCapUsd": coin.get("usd_market_cap"),
        "marketCapSol": coin.get("market_cap"),
        "totalSupplyRaw": str(coin.get("total_supply")) if coin.get("total_supply") is not None else None,
    }


def main() -> None:
    checked_at = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    with ThreadPoolExecutor(max_workers=3) as executor:
        on_chain_future = executor.submit(on_chain_data)
        market_future = executor.submit(market_data)
        pump_future = executor.submit(pump_fun_data)
        on_chain = on_chain_future.result()
        market = market_future.result()
        pump_fun = pump_future.result()
    result = {
        "schemaVersion": 1,
        "mint": MINT,
        "checkedAt": checked_at,
        "sources": {
            "onChain": "Solana JSON-RPC",
            "market": "DexScreener",
            "launch": "Pump.fun",
        },
        "onChain": on_chain,
        "market": market,
        "pumpFun": pump_fun,
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    try:
        history = json.loads(HISTORY.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        history = {"schemaVersion": 1, "mint": MINT, "methodology": "unique positive-balance Token-2022 account owners", "snapshots": []}
    snapshots = history.get("snapshots") if isinstance(history.get("snapshots"), list) else []
    snapshot = {
        "checkedAt": checked_at,
        "holders": result["onChain"]["uniquePositiveOwners"],
        "slot": result["onChain"]["slot"],
        "priceUsd": (result["market"] or {}).get("priceUsd"),
        "volume24h": (result["market"] or {}).get("volume24h"),
    }
    if snapshots:
        previous = datetime.fromisoformat(snapshots[-1]["checkedAt"].replace("Z", "+00:00"))
        current = datetime.fromisoformat(checked_at.replace("Z", "+00:00"))
        if (current - previous).total_seconds() < 45 * 60:
            snapshots[-1] = snapshot
        else:
            snapshots.append(snapshot)
    else:
        snapshots.append(snapshot)
    history["snapshots"] = snapshots[-1460:]
    HISTORY.write_text(json.dumps(history, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
