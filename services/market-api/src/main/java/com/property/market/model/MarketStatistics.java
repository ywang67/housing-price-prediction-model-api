package com.property.market.model;

public record MarketStatistics(
    long propertyCount,
    double averagePrice,
    double minimumPrice,
    double maximumPrice,
    double averageSquareFootage
) {
}
