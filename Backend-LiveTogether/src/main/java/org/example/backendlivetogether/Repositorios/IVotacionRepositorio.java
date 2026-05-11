package org.example.backendlivetogether.Repositorios;

import org.example.backendlivetogether.Modelos.Eleccion;
import org.example.backendlivetogether.Modelos.Vecino;
import org.example.backendlivetogether.Modelos.Voto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IVotacionRepositorio extends JpaRepository<Voto, Integer> {
    boolean existsByVecinoAndEleccion(Vecino vecino, Eleccion eleccion);

}
