package lk.ijse.pos_springboot_backend.service.impl;

import lk.ijse.pos_springboot_backend.dto.CustomerDTO;
import lk.ijse.pos_springboot_backend.entity.Customer;
import lk.ijse.pos_springboot_backend.repository.CustomerRepository;
import lk.ijse.pos_springboot_backend.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<CustomerDTO> getAllCustomer() {
        return modelMapper.map(customerRepository.findAll(), new TypeToken<List<CustomerDTO>>() {}.getType());
    }

    @Override
    public CustomerDTO getCustomer(String customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Staff with ID " + customerId + " not found"));
        return modelMapper.map(customer, CustomerDTO.class);    }

    @Override
    public String saveCustomer(CustomerDTO customerDTO) {
        Customer customer = Customer.builder()
                .id(generateCustomerID())
                .name(customerDTO.getName())
                .contact(customerDTO.getContact())
                .points(customerDTO.getPoints())
                .build();

        customerRepository.save(customer);
        return "Customer saved successfully";
    }

    private String generateCustomerID() {
            List<Customer> customers = customerRepository.findAll();
            if (customers.isEmpty()) {
                return "C001";
            }
            String lastId = customers.get(customers.size() - 1).getId();
            int newId = Integer.parseInt(lastId.substring(1)) + 1;

            return String.format("C%03d", newId);

    }

    @Override
    public String updateCustomer(CustomerDTO customerDTO) {
        Customer customer = Customer.builder()
                .id(customerDTO.getId())
                .name(customerDTO.getName())
                .contact(customerDTO.getContact())
                .points(customerDTO.getPoints())
                .build();

        customerRepository.save(customer);
        return "Customer updated successfully";    }

    @Override
    public String deleteCustomer(String customerId) {
        if (!customerRepository.existsById(customerId)) {
            throw new RuntimeException("Customer with ID " + customerId + " does not exist");
        }
        customerRepository.deleteById(customerId);
        return "Customer deleted successfully";
    }
}
