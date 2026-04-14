package lk.ijse.pos_springboot_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterDTO {
    @NotBlank
    private String username;
    @Email(message = "Invalid email format")
    @NotBlank
    private String email;
    @NotBlank
    private String password;
    private String role;
}