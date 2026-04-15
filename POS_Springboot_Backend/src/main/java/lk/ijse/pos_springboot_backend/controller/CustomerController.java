package lk.ijse.pos_springboot_backend.controller;

import jakarta.validation.Valid;
import lk.ijse.pos_springboot_backend.dto.CustomerDTO;
import lk.ijse.pos_springboot_backend.service.CustomerService;
import lk.ijse.pos_springboot_backend.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/customer")
public class CustomerController {

    private final CustomerService customerService;

    // SAVE CUSTOMER
    @PostMapping
    public ResponseEntity<ApiResponse> saveCustomer(@Valid @RequestBody CustomerDTO customerDTO) {
        return ResponseEntity.ok(new ApiResponse(
                200, "Customer Saved Successfully", customerService.saveCustomer(customerDTO))
        );
    }

    // GET ALL CUSTOMER
    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllCustomer() {
        List<CustomerDTO> customerList = customerService.getAllCustomer();
        return new ResponseEntity<>(
                new ApiResponse(200, "Success", customerList),
                HttpStatus.OK
        );
    }

    // GET CUSTOMER BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getCustomer(@PathVariable String id) {
        CustomerDTO customer = customerService.getCustomer(id);
        return new ResponseEntity<>(
                new ApiResponse(200, "Success", customer),
                HttpStatus.OK
        );
    }

    // UPDATE CUSTOMER
    @PutMapping
    public ResponseEntity<ApiResponse> updateCustomer(@Valid @RequestBody CustomerDTO customerDTO) {
        return new ResponseEntity<>(
                new ApiResponse(200, "Customer Updated Successfully", customerService.updateCustomer(customerDTO)),
                HttpStatus.OK
        );
    }

    // DELETE CUSTOMER
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteCustomer(@PathVariable String id) {
        return new ResponseEntity<>(
                new ApiResponse(200, "Customer Deleted Successfully", customerService.deleteCustomer(id)),
                HttpStatus.OK
        );
    }
}
