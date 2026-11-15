package com.massivemarketmanager.backend.position;

public enum Network {
    ETHEREUM(1), POLYGON(137), BSC(56), ARBITRUM(42161);
    public final int chainId;
    Network(int id) { this.chainId = id; }
}

