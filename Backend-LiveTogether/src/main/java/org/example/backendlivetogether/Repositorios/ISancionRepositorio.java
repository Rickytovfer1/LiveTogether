package org.example.backendlivetogether.Repositorios;

import org.example.backendlivetogether.Modelos.Sancion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ISancionRepositorio extends JpaRepository<Sancion, Integer>  {
}
