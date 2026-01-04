package org.example.backendlivetogether.Modelos;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "comunidad")
@Getter
@Setter
@ToString
@EqualsAndHashCode
@AllArgsConstructor
@NoArgsConstructor
public class Comunidad {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "direccion", nullable = false)
    private String direccion;

    @Column(name = "CIF", nullable = false)
    private String CIF;

    @Column(name = "codigoComunidad")
    private String codigoComunidad;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idPresidente")
    private Vecino presidente;

    @OneToMany(mappedBy = "comunidad", cascade = CascadeType.ALL)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<Vivienda> viviendas = new HashSet<>(0);

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Usuario usuario;

}
