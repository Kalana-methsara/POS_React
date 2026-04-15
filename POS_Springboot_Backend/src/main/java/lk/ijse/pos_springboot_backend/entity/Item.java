package lk.ijse.pos_springboot_backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import lk.ijse.pos_springboot_backend.entity.enums.UnitType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
public class Item {
    @Id
    private String id;
    private String description;
    private Double price;
    private int quantity;
    @Enumerated(EnumType.STRING)
    private UnitType unit;
}
