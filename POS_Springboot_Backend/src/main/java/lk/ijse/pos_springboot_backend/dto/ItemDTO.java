package lk.ijse.pos_springboot_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemDTO {
    private String id;
    private String description;
    private Double price;
    private int quantity;
    private String unit;
}
