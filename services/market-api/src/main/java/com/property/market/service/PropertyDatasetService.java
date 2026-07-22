package com.property.market.service;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.property.market.model.PropertyRecord;

@Service
public class PropertyDatasetService {

    private final List<PropertyRecord> properties;

    public PropertyDatasetService(
        @Value("${market.dataset-path}") String datasetPath
    ) {
        this.properties = loadProperties(Path.of(datasetPath));
    }

    public List<PropertyRecord> getProperties() {
        return properties;
    }

    private List<PropertyRecord> loadProperties(Path datasetPath) {
        try {
            return Files.lines(datasetPath)
                .skip(1)
                .filter(line -> !line.isBlank())
                .map(this::parseProperty)
                .toList();
        } catch (IOException error) {
            throw new UncheckedIOException(
                "Could not read housing dataset",
                error
            );
        }
    }

    private PropertyRecord parseProperty(String line) {
        String[] values = line.split(",");

        return new PropertyRecord(
            Long.parseLong(values[0]),
            Double.parseDouble(values[1]),
            Integer.parseInt(values[2]),
            Double.parseDouble(values[3]),
            Integer.parseInt(values[4]),
            Double.parseDouble(values[5]),
            Double.parseDouble(values[6]),
            Double.parseDouble(values[7]),
            Double.parseDouble(values[8])
        );
    }
}
