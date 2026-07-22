package com.property.market.service;

import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.property.market.model.MarketStatistics;
import com.property.market.model.PropertyRecord;

@Service
public class MarketAnalysisService {

    private final PropertyDatasetService datasetService;

    public MarketAnalysisService(
        PropertyDatasetService datasetService
    ) {
        this.datasetService = datasetService;
    }

    @Cacheable("marketStatistics")
    public MarketStatistics getStatistics() {
        List<PropertyRecord> properties =
            datasetService.getProperties();

        double averagePrice = properties.stream()
            .mapToDouble(PropertyRecord::price)
            .average()
            .orElse(0);

        double minimumPrice = properties.stream()
            .mapToDouble(PropertyRecord::price)
            .min()
            .orElse(0);

        double maximumPrice = properties.stream()
            .mapToDouble(PropertyRecord::price)
            .max()
            .orElse(0);

        double averageSquareFootage = properties.stream()
            .mapToDouble(PropertyRecord::squareFootage)
            .average()
            .orElse(0);

        return new MarketStatistics(
            properties.size(),
            averagePrice,
            minimumPrice,
            maximumPrice,
            averageSquareFootage
        );
    }

    public List<PropertyRecord> findProperties(
        Double minimumPrice,
        Double maximumPrice,
        Integer minimumBedrooms,
        Double minimumSchoolRating
    ) {
        return datasetService.getProperties()
            .stream()
            .filter(property ->
                minimumPrice == null ||
                property.price() >= minimumPrice
            )
            .filter(property ->
                maximumPrice == null ||
                property.price() <= maximumPrice
            )
            .filter(property ->
                minimumBedrooms == null ||
                property.bedrooms() >= minimumBedrooms
            )
            .filter(property ->
                minimumSchoolRating == null ||
                property.schoolRating() >= minimumSchoolRating
            )
            .toList();
    }
}
