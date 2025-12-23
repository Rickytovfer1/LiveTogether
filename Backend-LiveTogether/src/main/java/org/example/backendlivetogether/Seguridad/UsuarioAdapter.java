package org.example.backendlivetogether.Seguridad;

import org.example.backendlivetogether.Modelos.Usuario;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.lang.reflect.Field;
import java.util.Collection;
import java.util.List;

public class UsuarioAdapter implements UserDetails {

    private final Usuario usuario;

    public UsuarioAdapter(Usuario usuario) {
        this.usuario = usuario;
    }

    public Usuario getUsuario() {
        return this.usuario;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(usuario.getRol().toString()));
    }

    @Override
    public String getPassword() {
        return usuario.getContrasena();
    }

    @Override
    public String getUsername() {
        return usuario.getCorreo();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        try {
            Field enabledField = usuario.getClass().getDeclaredField("enabled");
            enabledField.setAccessible(true);
            return enabledField.getBoolean(usuario);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            throw new RuntimeException("Unable to access 'enabled' field in Usuario", e);
        }
    }
}
