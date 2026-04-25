package lk.ijse.pos_springboot_backend.controller;

import jakarta.validation.Valid;
import lk.ijse.pos_springboot_backend.dto.OrderRequestDTO;
import lk.ijse.pos_springboot_backend.service.OrderService;
import lk.ijse.pos_springboot_backend.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/order")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse> placeOrder(@Valid @RequestBody OrderRequestDTO orderRequestDTO) {
        return ResponseEntity.ok(
                new ApiResponse(200, "Order Placed Successfully", orderService.placeOrder(orderRequestDTO))
        );
    }
}
