package lk.ijse.pos_springboot_backend.controller;


import jakarta.validation.Valid;
import lk.ijse.pos_springboot_backend.dto.AuthDTO;
import lk.ijse.pos_springboot_backend.dto.RegisterDTO;
import lk.ijse.pos_springboot_backend.service.UserService;
import lk.ijse.pos_springboot_backend.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("api/v1/auth")
@CrossOrigin
@RequiredArgsConstructor
public class AuthController {

    private final UserService authService;

    @PostMapping("register")
    public ResponseEntity<ApiResponse> registerUser(@Valid @RequestBody RegisterDTO registerDTO) {
        return ResponseEntity.ok(new ApiResponse(200, "OK", authService.saveUser(registerDTO)));
    }

    @PostMapping("login")
    public ResponseEntity<ApiResponse> loginUser(@RequestBody AuthDTO authDTO) {
        return ResponseEntity.ok(new ApiResponse(200, "OK", authService.authenticate(authDTO)));
    }
}