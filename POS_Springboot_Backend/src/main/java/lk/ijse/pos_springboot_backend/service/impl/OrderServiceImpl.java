package lk.ijse.pos_springboot_backend.service.impl;

import lk.ijse.pos_springboot_backend.dto.OrderDetailDTO;
import lk.ijse.pos_springboot_backend.dto.OrderRequestDTO;
import lk.ijse.pos_springboot_backend.entity.Customer;
import lk.ijse.pos_springboot_backend.entity.Item;
import lk.ijse.pos_springboot_backend.entity.Order;
import lk.ijse.pos_springboot_backend.entity.OrderDetail;
import lk.ijse.pos_springboot_backend.repository.CustomerRepository;
import lk.ijse.pos_springboot_backend.repository.ItemRepository;
import lk.ijse.pos_springboot_backend.repository.OrderRepository;
import lk.ijse.pos_springboot_backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final ItemRepository itemRepository;

    @Override
    @Transactional
    public String placeOrder(OrderRequestDTO orderRequestDTO) {
        if (orderRequestDTO.getOrderDetails() == null || orderRequestDTO.getOrderDetails().isEmpty()) {
            throw new RuntimeException("Order details cannot be empty");
        }

        Customer customer = customerRepository.findById(orderRequestDTO.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Order order = Order.builder()
                .id(generateOrderID())
                .customer(customer)
                .orderDate(LocalDateTime.now())
                .total(0.0)
                .build();

        List<OrderDetail> details = new ArrayList<>();
        double total = 0.0;

        for (OrderDetailDTO detailDTO : orderRequestDTO.getOrderDetails()) {
            Item item = itemRepository.findById(detailDTO.getItemId())
                    .orElseThrow(() -> new RuntimeException("Item not found: " + detailDTO.getItemId()));

            if (item.getQuantity() < detailDTO.getQuantity()) {
                throw new RuntimeException("Insufficient stock for item: " + detailDTO.getItemId());
            }

            item.setQuantity(item.getQuantity() - detailDTO.getQuantity());

            double unitPrice = detailDTO.getUnitPrice() != null ? detailDTO.getUnitPrice() : item.getPrice();
            double lineTotal = unitPrice * detailDTO.getQuantity();
            total += lineTotal;

            OrderDetail orderDetail = OrderDetail.builder()
                    .order(order)
                    .item(item)
                    .quantity(detailDTO.getQuantity())
                    .unitPrice(unitPrice)
                    .lineTotal(lineTotal)
                    .build();
            details.add(orderDetail);
        }

        order.setOrderDetails(details);
        order.setTotal(total);
        orderRepository.save(order);
        return "Order placed successfully. Order ID: " + order.getId();
    }

    private String generateOrderID() {
        Optional<Order> lastOrder = orderRepository.findTopByOrderByIdDesc();
        if (lastOrder.isEmpty()) {
            return "O001";
        }

        String lastId = lastOrder.get().getId();
        int newId = Integer.parseInt(lastId.substring(1)) + 1;
        return String.format("O%03d", newId);
    }
}
