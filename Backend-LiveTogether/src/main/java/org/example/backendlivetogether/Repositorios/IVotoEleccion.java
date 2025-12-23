package org.example.backendlivetogether.Repositorios;

import org.example.backendlivetogether.Modelos.Voto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IVotoEleccion extends JpaRepository<Voto, Integer> {

}
