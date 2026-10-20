# =============================================================================
# PARTE 2, APLICACION 3: CIRCUITO RLC EN SERIE
# =============================================================================
# Ecuacion que se resuelve (ley de voltajes de Kirchhoff):
#
#       L q'' + R q' + q / C = E(t)
#
# con L = 1 H, C = 0.04 F, q(0) = 0, q'(0) = 0.
#
# Como se resuelve:
#   1. Se convierte la ecuacion de segundo orden en un sistema de primer orden
#      con y1 = q (carga) y y2 = I = q' (corriente).
#   2. Se integra el sistema con RK4 escrito a mano (solo numpy y matplotlib,
#      sin solve_ivp, odeint ni sympy).
#   3. Se compara con la solucion analitica deducida en el informe.
#
# Para ejecutar:   python parte2_rlc_comentado.py
# Genera las figuras fig_rlc_*.pdf e imprime en pantalla los numeros que
# se usan en las tablas del informe.
#
# -----------------------------------------------------------------------------
# GLOSARIO DE VARIABLES
# -----------------------------------------------------------------------------
# Parametros fisicos
#   L        inductancia de la bobina (H)
#   C        capacitancia del capacitor (F)
#   R        resistencia (ohm). Se prueban R = 2, 10 y 12
#   E0       voltaje de la fuente (V). Es constante en la parte a y es la
#            amplitud de E0*cos(w t) en la parte b
#   E(t)     voltaje de la fuente en el tiempo t (V)
#   w        frecuencia angular de la fuente senoidal (rad/s)
#
# Magnitudes del circuito
#   q        carga del capacitor (C)
#   I        corriente, I = q' (A)
#   qp       carga estacionaria cuando E es constante, qp = E0*C (C)
#   qf       lo mismo que qp, usado al graficar y medir asentamiento
#
# Cantidades derivadas
#   al       alpha = R/(2L): rapidez con que decae la oscilacion (1/s)
#   wd       frecuencia amortiguada, sqrt(4L/C - R^2)/(2L) (rad/s)
#   disc     discriminante de la ecuacion caracteristica, R^2 - 4L/C
#            (disc < 0 subamortiguado, = 0 critico, > 0 sobreamortiguado)
#   r1, r2   raices reales de la ecuacion caracteristica (caso sobreamort.)
#   A, B     constantes de la parte homogenea, e^(-al t)(A cos + B sin)
#   C1, C2   constantes del caso sobreamortiguado
#   P, S     coeficientes de cos(wt) y sin(wt) en la carga estacionaria
#   D2       D^2 = (1/(LC) - w^2)^2 + (R/L)^2 w^2, denominador comun
#   w0sq     frecuencia natural al cuadrado, 1/(LC) = 25
#
# Parte estacionaria y transitoria (caso forzado)
#   q_est, I_est   carga y corriente estacionarias (permanecen siempre)
#   q_tr,  I_tr    carga y corriente transitorias (se apagan como e^(-t))
#
# Metodos numericos
#   F        funcion que da la derivada del sistema, F(t, Y) = Y'
#   Y        vector de estado [q, I]. Y[k] es el estado en el paso k
#   Y0       condicion inicial del vector de estado
#   t0, T    tiempo inicial y final de la simulacion (s)
#   h        tamano de paso (s). hh se usa cuando se barren varios pasos
#   N        numero de pasos, N = (T - t0)/h
#   k1..k4   las cuatro pendientes de RK4
#   ti, yi   tiempo y estado en el paso actual
#
# Figuras y barridos
#   t_fino   rejilla de tiempo fina para dibujar la solucion analitica
#   t_s      rejilla de tiempo para medir sobrepaso y asentamiento
#   ws       rejilla de frecuencias para la curva de resonancia
#   w_num    frecuencias en las que se simula con RK4 para comparar
#   I_num    amplitud de corriente medida en la simulacion
#   Q_num    amplitud de carga medida en la simulacion
#   NOMBRE   nombre del regimen para cada R
#   ESTILO   estilo de linea de cada R (todo en blanco y negro)
# =============================================================================

import numpy as np
import matplotlib.pyplot as plt

# Estilo comun de las figuras: letra de 10 pt, cuadricula suave y tamano base.
plt.rcParams.update({
    "font.size": 10,
    "axes.grid": True,
    "grid.alpha": 0.3,
    "figure.figsize": (6.2, 3.8),
})

# ---------------------------------------------------------------- parametros
L, C = 1.0, 0.04           # inductancia (H) y capacitancia (F)
E0 = 12.0                  # voltaje de la fuente (V)
Rs = [2.0, 10.0, 12.0]     # las tres resistencias que pide el enunciado (ohm)
NOMBRE = {2.0: "subamortiguado", 10.0: "críticamente amortiguado",
          12.0: "sobreamortiguado"}
ESTILO = {2.0: "-", 10.0: "--", 12.0: ":"}   # continua, rayada, punteada
T = 5.0                    # tiempo final de la simulacion (s)


# ============================================================================
# METODOS NUMERICOS
# ============================================================================
def rk4_sistema(F, t0, Y0, T, h):
    # Runge-Kutta de orden 4 para un sistema Y' = F(t, Y).
    # Devuelve el vector de tiempos t y la matriz Y, donde cada fila es el
    # estado [q, I] en ese instante.
    N = int(round((T - t0) / h))        # numero de pasos
    t = t0 + h * np.arange(N + 1)       # t0, t0+h, t0+2h, ..., T
    Y = np.zeros((N + 1, len(Y0)))      # una fila por instante, una columna por variable
    Y[0] = Y0                           # condicion inicial
    for i in range(N):
        ti, yi = t[i], Y[i]
        # Cuatro pendientes: al inicio, dos en el punto medio y una al final
        k1 = F(ti, yi)
        k2 = F(ti + h / 2, yi + h / 2 * k1)
        k3 = F(ti + h / 2, yi + h / 2 * k2)
        k4 = F(ti + h, yi + h * k3)
        # Promedio ponderado (1, 2, 2, 1)/6 de las pendientes
        Y[i + 1] = yi + h / 6 * (k1 + 2 * k2 + 2 * k3 + k4)
    return t, Y


def euler_sistema(F, t0, Y0, T, h):
    # Euler explicito para sistemas. Solo se usa para comparar con RK4.
    # Cada paso avanza con la pendiente del punto inicial.
    N = int(round((T - t0) / h))
    t = t0 + h * np.arange(N + 1)
    Y = np.zeros((N + 1, len(Y0)))
    Y[0] = Y0
    for i in range(N):
        Y[i + 1] = Y[i] + h * F(t[i], Y[i])
    return t, Y


def campo_rlc(R, E):
    # Construye la funcion F(t, Y) del circuito para una resistencia R dada y
    # una fuente E(t) dada.
    # Con y1 = q e y2 = I:
    #     y1' = y2
    #     y2' = (E(t) - R*y2 - y1/C) / L      (despejando q'' de la ecuacion)
    def F(t, Y):
        return np.array([Y[1], (E(t) - R * Y[1] - Y[0] / C) / L])
    return F


# ============================================================================
# SOLUCIONES ANALITICAS
# ============================================================================
def rlc_constante(t, R):
    # Solucion exacta (q, I) cuando la fuente es constante, E(t) = E0.
    # q = (solucion particular constante) + (solucion homogenea).
    qp = E0 * C                          # carga final del capacitor, 0.48 C
    al = R / (2 * L)                     # alpha
    disc = R**2 - 4 * L / C              # signo del discriminante: tipo de caso
    if disc < 0:
        # Subamortiguado: raices complejas -al +- i*wd, el sistema oscila
        wd = np.sqrt(-disc) / (2 * L)
        A = -qp                          # de q(0) = 0
        B = al * A / wd                  # de q'(0) = 0
        q = qp + np.exp(-al * t) * (A * np.cos(wd * t) + B * np.sin(wd * t))
        I = E0 / (L * wd) * np.exp(-al * t) * np.sin(wd * t)
    elif disc == 0:
        # Critico: raiz doble -al, solucion (A + B t) e^(-al t)
        A = -qp
        B = al * A
        q = qp + (A + B * t) * np.exp(-al * t)
        I = E0 / L * t * np.exp(-al * t)
    else:
        # Sobreamortiguado: dos raices reales negativas r1 y r2
        r1 = (-R + np.sqrt(disc)) / (2 * L)
        r2 = (-R - np.sqrt(disc)) / (2 * L)
        # C1 y C2 salen de q(0) = 0 y q'(0) = 0
        C1 = -qp * r2 / (r2 - r1)
        C2 = -qp - C1
        q = qp + C1 * np.exp(r1 * t) + C2 * np.exp(r2 * t)
        I = E0 / (L * (r1 - r2)) * (np.exp(r1 * t) - np.exp(r2 * t))
    return q, I


def rlc_forzado(t, w, R=2.0):
    # Solucion exacta para E(t) = E0 cos(w t), separada en parte estacionaria
    # y parte transitoria. Devuelve (q_est, I_est, q_tr, I_tr).
    al = R / (2 * L)
    wd = np.sqrt(4 * L / C - R**2) / (2 * L)     # solo el caso subamortiguado
    w0sq = 1 / (L * C)                           # frecuencia natural al cuadrado
    D2 = (w0sq - w**2) ** 2 + (R / L) ** 2 * w**2

    # Parte estacionaria: q_est = P cos(wt) + S sin(wt). Se obtiene al
    # sustituir en la ecuacion e igualar los coeficientes de cos y sin.
    P = (E0 / L) * (w0sq - w**2) / D2
    S = (E0 / L) * (R / L) * w / D2
    q_est = P * np.cos(w * t) + S * np.sin(w * t)
    I_est = w * (-P * np.sin(w * t) + S * np.cos(w * t))   # derivada de q_est

    # Parte transitoria: e^(-al t)(A cos(wd t) + B sin(wd t)). A y B se
    # fijan para que la suma total cumpla q(0) = 0 y q'(0) = 0.
    A = -P
    B = (al * A - w * S) / wd
    ex = np.exp(-al * t)
    q_tr = ex * (A * np.cos(wd * t) + B * np.sin(wd * t))
    I_tr = ex * ((-al * A + wd * B) * np.cos(wd * t)
                 + (-al * B - wd * A) * np.sin(wd * t))     # derivada de q_tr
    return q_est, I_est, q_tr, I_tr


def amplitud_corriente(w, R=2.0):
    # Amplitud de la corriente estacionaria: I0 = E0 / sqrt(R^2 + X^2), con la
    # reactancia total X = L w - 1/(C w). Es maxima cuando X = 0, es decir
    # en w = 1/sqrt(LC).
    X = L * w - 1 / (C * w)
    return E0 / np.sqrt(R**2 + X**2)


def amplitud_carga(w, R=2.0):
    # Amplitud de la carga estacionaria. Su maximo queda en
    # sqrt(1/(LC) - R^2/(2 L^2)), un poco antes que el de la corriente.
    return E0 / np.sqrt((1 / C - L * w**2) ** 2 + (R * w) ** 2)


def asentamiento_carga(t, q, qf, banda=0.02):
    # Primer instante a partir del cual q se queda dentro del 2 % de su valor
    # final qf para siempre.
    fuera = np.where(np.abs(q - qf) > banda * abs(qf))[0]
    if len(fuera) == 0:
        return 0.0
    return t[fuera[-1] + 1]


# ============================================================================
# RESULTADOS
# ============================================================================
if __name__ == "__main__":
    t_fino = np.linspace(0, T, 2001)    # 2001 puntos para curvas suaves
    qf = E0 * C
    print(f"Carga estacionaria E0*C = {qf:.4f} C,  w0 = 1/sqrt(LC) = {1/np.sqrt(L*C):.4f} rad/s")
    print(f"R critica = 2*sqrt(L/C) = {2*np.sqrt(L/C):.4f} ohm")

    # ---- Raices de la ecuacion caracteristica para cada R
    print("\n== Raices ==")
    for R in Rs:
        disc = R**2 - 4 * L / C
        if disc < 0:
            print(f"R={R:>4g}: r = {-R/2:.0f} +- {np.sqrt(-disc)/2:.4f} i  ({NOMBRE[R]})")
        else:
            r1 = (-R + np.sqrt(disc)) / 2
            r2 = (-R - np.sqrt(disc)) / 2
            print(f"R={R:>4g}: r1 = {r1:.4f}, r2 = {r2:.4f}  ({NOMBRE[R]})")

    # ---- Figuras 1 y 2: carga q(t) y corriente I(t), analitica contra RK4
    figq, axq = plt.subplots()
    figi, axi = plt.subplots()
    for R in Rs:
        # Simulacion con RK4, paso h = 0.01, empezando con q = 0 e I = 0
        t, Y = rk4_sistema(campo_rlc(R, lambda s: E0), 0, [0.0, 0.0], T, 0.01)
        q, I = rlc_constante(t_fino, R)
        # Linea: solucion analitica. Circulos: RK4 (uno de cada 25 puntos)
        axq.plot(t_fino, q, "k" + ESTILO[R], label=f"R = {R:g} Ω, analítica")
        axi.plot(t_fino, I, "k" + ESTILO[R], label=f"R = {R:g} Ω, analítica")
        axq.plot(t[::25], Y[::25, 0], "ko", ms=3, mfc="white",
                 label="RK4 (h = 0.01)" if R == 2.0 else None)
        axi.plot(t[::25], Y[::25, 1], "ko", ms=3, mfc="white",
                 label="RK4 (h = 0.01)" if R == 2.0 else None)
    axq.axhline(qf, color="k", lw=0.6)          # nivel final de carga
    axq.text(3.4, qf + 0.015, "q = E₀C = 0.48 C", fontsize=8)
    axq.set_xlabel("t (s)"); axq.set_ylabel("q(t) (C)")
    axq.set_title("Carga del capacitor con E = 12 V constante")
    axq.legend(fontsize=8); figq.tight_layout()
    figq.savefig("fig_rlc_carga.pdf")
    axi.axhline(0, color="k", lw=0.6)
    axi.set_xlabel("t (s)"); axi.set_ylabel("I(t) (A)")
    axi.set_title("Corriente en el circuito con E = 12 V constante")
    axi.legend(fontsize=8); figi.tight_layout()
    figi.savefig("fig_rlc_corriente.pdf")

    # ---- Datos clave: sobrepaso, picos y tiempo de asentamiento
    print("\n== Datos clave (E constante) ==")
    t_s = np.linspace(0, 10, 100001)
    for R in Rs:
        q, I = rlc_constante(t_s, R)
        print(f"R={R:>4g}: q_max={q.max():.4f} C en t={t_s[q.argmax()]:.3f} s, "
              f"sobrepaso={(q.max()-qf)/qf*100:.1f} %, "
              f"I_max={I.max():.4f} A en t={t_s[I.argmax()]:.3f} s, "
              f"t_asent(2%)={asentamiento_carga(t_s, q, qf):.3f} s")

    # ---- Error de Euler y de RK4 frente a la solucion analitica
    # Se toma el error maximo de q sobre todo el intervalo [0, 5].
    print("\n== Error maximo en q, [0,5] ==")
    print(f"{'R':>4} {'h':>7} {'Euler':>12} {'RK4':>12}")
    for R in Rs:
        for hh in (0.1, 0.05, 0.025):
            F = campo_rlc(R, lambda s: E0)
            te, Ye = euler_sistema(F, 0, [0.0, 0.0], T, hh)
            tr, Yr = rk4_sistema(F, 0, [0.0, 0.0], T, hh)
            ee = np.max(np.abs(Ye[:, 0] - rlc_constante(te, R)[0]))
            er = np.max(np.abs(Yr[:, 0] - rlc_constante(tr, R)[0]))
            print(f"{R:>4g} {hh:>7} {ee:>12.3e} {er:>12.3e}")

    # ---- Orden de convergencia observado de RK4 (R = 2), error en t = 5
    # orden p = log2(error con h / error con h/2). Para RK4 deberia ser cerca
    # de 4, aunque medido en un solo instante puede salir irregular.
    print("\n== Orden observado de RK4 (R=2), error en t=5 ==")
    hs = [0.1, 0.05, 0.025, 0.0125]
    errs = []
    for hh in hs:
        t, Y = rk4_sistema(campo_rlc(2.0, lambda s: E0), 0, [0.0, 0.0], T, hh)
        errs.append(abs(Y[-1, 0] - rlc_constante(np.array(T), 2.0)[0]))
    for i in range(len(hs)):
        p = np.log2(errs[i - 1] / errs[i]) if i > 0 else float("nan")
        print(f"h={hs[i]:<7} err={errs[i]:.3e}  orden={p:.2f}")

    # ---- Parte b: fuente E = 12 cos(w t) con R = 2
    # Se comprueba que la suma analitica (estacionaria + transitoria) coincide
    # con la simulacion RK4 para tres frecuencias.
    print("\n== Parte b: verificacion de la descomposicion (R=2) ==")
    for w in (3.0, 5.0, 7.0):
        F = campo_rlc(2.0, lambda s, w=w: E0 * np.cos(w * s))
        t, Y = rk4_sistema(F, 0, [0.0, 0.0], 8.0, 0.002)
        qe, Ie, qt, It = rlc_forzado(t, w)
        print(f"w={w}: max|q_RK4-(q_est+q_trans)|={np.max(np.abs(Y[:,0]-(qe+qt))):.2e}, "
              f"max|I_RK4-(I_est+I_trans)|={np.max(np.abs(Y[:,1]-(Ie+It))):.2e}")

    # Figura 3: descomposicion en el caso de resonancia, w = 5 rad/s
    w = 5.0
    F = campo_rlc(2.0, lambda s: E0 * np.cos(w * s))
    t, Y = rk4_sistema(F, 0, [0.0, 0.0], 8.0, 0.005)
    tf = np.linspace(0, 8, 4001)
    qe, Ie, qt, It = rlc_forzado(tf, w)
    fig, (a1, a2) = plt.subplots(2, 1, figsize=(6.2, 5.6), sharex=True)
    # Arriba: carga. Linea continua = total, rayada = estacionaria,
    # punteada = transitoria, circulos = RK4
    a1.plot(tf, qe + qt, "k-", label="q total (analítica)")
    a1.plot(tf, qe, "k--", lw=1, label="parte estacionaria")
    a1.plot(tf, qt, "k:", lw=1.3, label="parte transitoria")
    a1.plot(t[::20], Y[::20, 0], "ko", ms=3, mfc="white", label="RK4")
    a1.set_ylabel("q(t) (C)"); a1.set_ylim(-1.5, 2.3)    # espacio para la leyenda
    a1.legend(fontsize=7, ncol=3, loc="upper center")
    a1.set_title("R = 2 Ω, E = 12 cos(5t) V")
    # Abajo: lo mismo para la corriente
    a2.plot(tf, Ie + It, "k-", label="I total (analítica)")
    a2.plot(tf, Ie, "k--", lw=1, label="parte estacionaria")
    a2.plot(tf, It, "k:", lw=1.3, label="parte transitoria")
    a2.plot(t[::20], Y[::20, 1], "ko", ms=3, mfc="white", label="RK4")
    a2.set_xlabel("t (s)"); a2.set_ylabel("I(t) (A)")
    a2.set_ylim(-7.5, 11.5)
    a2.legend(fontsize=7, ncol=3, loc="upper center")
    fig.tight_layout()
    fig.savefig("fig_rlc_forzado.pdf")

    # ---- Curva de resonancia: analitica y puntos simulados con RK4
    ws = np.linspace(0.2, 10, 600)
    w_num = np.array([1, 2, 3, 4, 4.5, 5, 5.5, 6, 7, 8, 9])
    I_num, Q_num = [], []
    for wn in w_num:
        F = campo_rlc(2.0, lambda s, wn=wn: E0 * np.cos(wn * s))
        tn, Yn = rk4_sistema(F, 0, [0.0, 0.0], 20.0, 0.005)
        # Se mide la amplitud solo cuando t >= 14 s, ya sin transitorio
        mask = tn >= 14.0
        I_num.append(np.max(np.abs(Yn[mask, 1])))
        Q_num.append(np.max(np.abs(Yn[mask, 0])))
    I_num, Q_num = np.array(I_num), np.array(Q_num)

    fig, ax = plt.subplots()
    ax.plot(ws, amplitud_corriente(ws), "k-", label="amplitud de I (analítica)")
    ax.plot(w_num, I_num, "ko", ms=4, mfc="white", label="RK4")
    ax.axvline(5.0, color="k", ls="--", lw=0.9)    # frecuencia de resonancia
    ax.text(5.15, 0.6, "ω = 1/√(LC) = 5", fontsize=8)
    ax.set_xlabel("ω (rad/s)"); ax.set_ylabel("amplitud de I estacionaria (A)")
    ax.set_title("Resonancia del circuito RLC (R = 2 Ω)")
    ax.legend(fontsize=8)
    fig.tight_layout()
    fig.savefig("fig_rlc_resonancia.pdf")

    # ---- Datos de resonancia
    print("\n== Resonancia ==")
    print(f"I0(5) analitica = {amplitud_corriente(5.0):.4f} A  (E0/R = {E0/2:.1f} A)")
    i_max = ws[np.argmax(amplitud_corriente(ws))]
    q_max = ws[np.argmax(amplitud_carga(ws))]
    print(f"w que maximiza I0 (barrido) = {i_max:.3f} rad/s")
    print(f"w que maximiza amplitud de q (barrido) = {q_max:.3f} rad/s, sqrt(23) = {np.sqrt(23):.3f}")
    print(f"{'w':>5} {'I0 analit':>10} {'I0 RK4':>10}")
    for wn, ii in zip(w_num, I_num):
        print(f"{wn:>5g} {amplitud_corriente(wn):>10.4f} {ii:>10.4f}")
    # Factor de calidad: que tan estrecho es el pico de resonancia
    print("Factor de calidad Q = (1/R) sqrt(L/C) =", round(np.sqrt(L / C) / 2.0, 3))