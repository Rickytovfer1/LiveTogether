package org.example.backendlivetogether.Servicios;

import lombok.AllArgsConstructor;
import org.example.backendlivetogether.DTOs.LoginDTO;
import org.example.backendlivetogether.DTOs.RegistrarComunidadDTO;
import org.example.backendlivetogether.DTOs.RegistrarVecinoDTO;
import org.example.backendlivetogether.DTOs.RespuestaDTO;
import org.example.backendlivetogether.Enumerados.Rol;
import org.example.backendlivetogether.Modelos.Comunidad;
import org.example.backendlivetogether.Modelos.Usuario;
import org.example.backendlivetogether.Modelos.Vecino;
import org.example.backendlivetogether.Modelos.VerificationToken;
import org.example.backendlivetogether.Repositorios.IComunidadRepositorio;
import org.example.backendlivetogether.Repositorios.IUsuarioRepositorio;
import org.example.backendlivetogether.Repositorios.IVecinoRepositorio;
import org.example.backendlivetogether.Repositorios.IVerificationTokenRepositorio;
import org.example.backendlivetogether.Seguridad.JWTService;
import org.example.backendlivetogether.Seguridad.UsuarioAdapter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UsuarioServicio implements UserDetailsService{

    private IUsuarioRepositorio usuarioRepositorio;

    private final PasswordEncoder passwordEncoder;

    private JWTService jwtService;

    private IVecinoRepositorio iVecinoRepositorio;

    private IComunidadRepositorio iComunidadRepositorio;

    private IVerificationTokenRepositorio iVerificationTokenRepositorio;

    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepositorio.findTopByCorreo(correo)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        return new UsuarioAdapter(usuario);
    }

    public ResponseEntity<RespuestaDTO> login(LoginDTO dto) {

        UserDetails userDetails = loadUserByUsername(dto.getCorreo());
        if (userDetails == null) {
            throw new UsernameNotFoundException("Usuario no encontrado");
        }

        if (!userDetails.isEnabled()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(RespuestaDTO.builder()
                            .estado(HttpStatus.UNAUTHORIZED.value())
                            .mensaje("Cuenta no verificada. Por favor, verifica tu correo electrónico.")
                            .build());
        }

        if (passwordEncoder.matches(dto.getContrasena(), userDetails.getPassword())) {
            Usuario usuario = ((UsuarioAdapter) userDetails).getUsuario();
            String token = jwtService.generateToken(usuario);
            return ResponseEntity.ok(RespuestaDTO.builder()
                    .estado(HttpStatus.OK.value())
                    .token(token)
                    .build());
        } else {
            throw new BadCredentialsException("Contraseña incorrecta");
        }
    }

    public Usuario registrarVecino(RegistrarVecinoDTO dto) {
        Usuario nuevoUsuario = new Usuario();
        Vecino vecino = new Vecino();

        nuevoUsuario.setCorreo(dto.getCorreo());
        nuevoUsuario.setContrasena(passwordEncoder.encode(dto.getContrasena()));
        nuevoUsuario.setRol(Rol.VECINO);

        vecino.setNombre(dto.getNombre());
        vecino.setApellidos(dto.getApellidos());
        vecino.setDni(dto.getDni());

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate fechaNacimiento = LocalDate.parse(dto.getFechaNacimiento(), formatter);
        vecino.setFechaNacimiento(fechaNacimiento);

        vecino.setTelefono(dto.getTelefono());

        vecino.setUsuario(nuevoUsuario);
        iVecinoRepositorio.save(vecino);

        return nuevoUsuario;
    }

    public Usuario registrarComunidad(RegistrarComunidadDTO dto){

        Usuario nuevoUsuario = new Usuario();
        Comunidad comunidad = new Comunidad();

        nuevoUsuario.setCorreo(dto.getCorreo());
        nuevoUsuario.setContrasena(passwordEncoder.encode(dto.getContrasena()));
        nuevoUsuario.setRol(Rol.COMUNIDAD);

        comunidad.setNombre(dto.getNombre());
        comunidad.setDireccion(dto.getDireccion());
        comunidad.setCIF(dto.getCif());

        Vecino presidente = iVecinoRepositorio.findById(dto.getIdPresidente())
                .orElseThrow(() -> new RuntimeException("No existe un presidente con este ID."));

        comunidad.setPresidente(presidente);

        Usuario usuarioGuardado = usuarioRepositorio.save(nuevoUsuario);
        comunidad.setUsuario(usuarioGuardado);

        iComunidadRepositorio.save(comunidad);

        return usuarioGuardado;
    }

}
