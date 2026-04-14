package lk.ijse.pos_springboot_backend.service;

import lk.ijse.pos_springboot_backend.dto.AuthDTO;
import lk.ijse.pos_springboot_backend.dto.AuthResponseDTO;
import lk.ijse.pos_springboot_backend.dto.RegisterDTO;

public interface UserService {
    String saveUser(RegisterDTO registerDTO);
    AuthResponseDTO authenticate(AuthDTO authDTO);
}
