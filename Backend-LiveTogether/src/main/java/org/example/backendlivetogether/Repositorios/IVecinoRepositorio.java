package org.example.backendlivetogether.Repositorios;

import org.example.backendlivetogether.Modelos.Vecino;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IVecinoRepositorio extends JpaRepository<Vecino, Integer> {
    Vecino findByUsuario_Id(Integer idUsuario);

}
