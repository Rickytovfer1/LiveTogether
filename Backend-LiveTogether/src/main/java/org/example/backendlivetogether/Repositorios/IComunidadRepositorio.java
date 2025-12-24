package org.example.backendlivetogether.Repositorios;

import org.example.backendlivetogether.Modelos.Comunidad;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IComunidadRepositorio extends JpaRepository<Comunidad, Integer> {

    Comunidad findByUsuario_Id(Integer idUsuario);
}
