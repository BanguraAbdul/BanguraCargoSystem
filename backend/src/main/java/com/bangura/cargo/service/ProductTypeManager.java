package com.bangura.cargo.service;

import com.bangura.cargo.model.ProductType;
import com.bangura.cargo.repository.ProductTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductTypeManager implements ProductTypeService {

    @Autowired
    private ProductTypeRepository productTypeRepository;

    @Override
    public ProductType createProductType(ProductType productType) {
        if (productTypeRepository.existsByName(productType.getName())) {
            throw new RuntimeException("Product type already exists");
        }
        return productTypeRepository.save(productType);
    }

    @Override
    public ProductType getProductTypeById(Long id) {
        return productTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product type not found"));
    }

    @Override
    public List<ProductType> getAllProductTypes() {
        return productTypeRepository.findAll();
    }

    @Override
    public ProductType updateProductType(Long id, ProductType updatedProductType) {
        ProductType productType = getProductTypeById(id);
        productType.setName(updatedProductType.getName());
        productType.setDescription(updatedProductType.getDescription());
        return productTypeRepository.save(productType);
    }

    @Override
    public void deleteProductType(Long id) {
        productTypeRepository.deleteById(id);
    }
}
