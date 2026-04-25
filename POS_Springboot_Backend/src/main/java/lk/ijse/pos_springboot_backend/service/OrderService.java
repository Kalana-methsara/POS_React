package lk.ijse.pos_springboot_backend.service;

import lk.ijse.pos_springboot_backend.dto.OrderRequestDTO;

public interface OrderService {
    String placeOrder(OrderRequestDTO orderRequestDTO);
}
