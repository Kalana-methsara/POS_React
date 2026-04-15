package lk.ijse.pos_springboot_backend.service;

import lk.ijse.pos_springboot_backend.dto.CustomerDTO;

import java.util.List;

public interface CustomerService {
    List<CustomerDTO> getAllCustomer();
    CustomerDTO getCustomer(String customerId);
    String saveCustomer(CustomerDTO customerDTO);
    String updateCustomer(CustomerDTO customerDTO);
    String deleteCustomer(String customerId);
}
