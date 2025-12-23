package org.example.backendlivetogether.Modelos;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "vecino")
@Getter
@Setter
@ToString
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class Vecino {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "apellidos", nullable = false)
    private String apellidos;

    @Column(name = "telefono", nullable = false)
    private String telefono;

    @Column(name = "fecha_nacimiento", nullable = false)
    private LocalDate fechaNacimiento;

    @Column(name = "numero_cuenta", nullable = false)
    private String numCuenta;

    @Column(name = "dni", nullable = false)
    private String dni;

    @Column(name = "fotoPerfil")
    private String fotoPerfil;

    @ManyToMany(cascade = CascadeType.PERSIST, fetch = FetchType.LAZY)
    @JoinTable(name = "vecinos_viviendas",
            joinColumns = {@JoinColumn(name = "idVecino", nullable = false)} ,
            inverseJoinColumns ={@JoinColumn(name = "idVivienda", nullable = false)})
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<Vivienda> viviendas = new HashSet<>(0);

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Usuario usuario;

}
