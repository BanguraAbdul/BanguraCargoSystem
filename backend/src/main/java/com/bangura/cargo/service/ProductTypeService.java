package com.bangura.cargo.service;

import com.bangura.cargo.model.ProductType;

import java.util.List;

public interface ProductTypeService {

    ProductType createProductType(ProductType productType);

    ProductType getProductTypeById(Long id);

    List<ProductType> getAllProductTypes();

    ProductType updateProductType(Long id, ProductType updatedProductType);

    void deleteProductType(Long id);
}
