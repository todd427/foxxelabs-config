#!/usr/bin/env python3
"""
Streamed-grain L1 construction: capture-fraction / contamination model.

Question: can a lunar-surface mass driver throw a fine regolith stream to a
collector at Earth-Moon L1, to be accreted and sintered into structure, without
(a) requiring an implausibly large collector and (b) shedding a contaminating
dust cloud into cislunar space?

Result: NO for the lunar-surface -> L1 baseline. The multi-day ballistic transit
integrates differential solar radiation pressure across any realistic grain-size
spread into a tens-of-km arrival smear, forcing tens-of-km collectors and leaving
tens of t/yr of persistent (non-blowout) escaping dust. Closes only for short
baselines (driver staged near the point) or coarse, tightly-sorted slugs -- at
which point the architecture collapses onto O'Neill (1977) guided canisters or
Quadrelli (2014, NIAC Orbiting Rainbows) laser-confined clouds, from opposite ends.

Design rule: viable iff  (transit_time^2 x differential_RP_accel) << collector_scale.

Caveats (all make the result modestly WORSE, none rescue it):
  - planar; lunar two-body for the arc (not full CR3BP)
  - lumped/constant Sun-line; real Sun-angle rotates ~40 deg over a 3-day transit,
    adding smear not modelled here
  - Q_pr = 1 (geometric optics); irregular grains scatter, raising effective drift
"""
import numpy as np
from scipy.optimize import brentq

# ---- constants (SI) ----
G=6.674e-11; ME=5.972e24; MM=7.342e22; RM=1.737e6; AEM=3.844e8
S=1361.0; c=2.998e8; AU=1.496e11; MSUN=1.989e30
muE=G*ME; muM=G*MM; muS=G*MSUN
Om=np.sqrt(G*(ME+MM)/AEM**3); xcm=AEM*MM/(ME+MM)
rho=3000.0; Qpr=1.0

# ---- Earth-Moon L1 via effective-potential stationary point (rotating frame) ----
def Ueff(x): return -muE/x - muM/abs(AEM-x) - 0.5*Om**2*(x-xcm)**2
def dUeff(x,h=10.0): return (Ueff(x+h)-Ueff(x-h))/(2*h)
xL1=brentq(dUeff,0.80*AEM,AEM-1e5); D=AEM-xL1
hc=2e4; Uxx=(Ueff(xL1+hc)-2*Ueff(xL1)+Ueff(xL1-hc))/hc**2
lam=np.sqrt(-Uxx)

a_rp=lambda r: 3*Qpr*S/(4*rho*r*c)                  # transverse RP accel (worst case)
beta=lambda r: (Qpr*S*np.pi*r**2/c)/(muS*(4/3)*np.pi*r**3*rho/AU**2)
x0=AEM-RM; C=Ueff(xL1)

def trajectory(dCfrac):
    """transit time, arrival speed at L1, launch speed -- for excess Jacobi energy."""
    Cx=C+dCfrac*abs(C)
    sp=lambda x: (lambda v: np.sqrt(v) if v>0 else 0.0)(2*(Cx-Ueff(x)))
    xs=np.linspace(x0,xL1,400000); vs=np.array([sp(x) for x in xs]); g=vs>0.5
    xt,vt=xs[g],vs[g]
    return np.sum(np.abs(np.diff(xt))/(0.5*(vt[1:]+vt[:-1]))), sp(xL1), sp(x0)

def cap(Rc,rmed_um,spread,theta_as,t,N=150000,seed=0):
    """Monte-Carlo transverse capture fraction. RP mean (bias) corrected by aim;
    only the size-spread residual + Gaussian pointing survive."""
    rng=np.random.default_rng(seed)
    sg=np.sqrt(np.log(1+spread**2)); r=np.exp(rng.normal(np.log(rmed_um*1e-6),sg,N))
    res=0.5*a_rp(r)*t**2; res-=res.mean()
    th=theta_as*np.pi/180/3600
    mx=res+rng.normal(0,th,N)*D; my=rng.normal(0,th,N)*D
    return np.mean(np.hypot(mx,my)<=Rc)

def Rc_need(tgt,rmed,spread,theta,t):
    lo,hi=10.,500e3
    for _ in range(38):
        m=0.5*(lo+hi)
        if cap(m,rmed,spread,theta,t,N=100000,seed=1)<tgt: lo=m
        else: hi=m
    return 0.5*(lo+hi)

if __name__=="__main__":
    print(f"Earth-Moon L1: {D/1e3:,.0f} km from Moon ({D/AEM:.3f} a_EM); "
          f"unstable e-fold 1/lambda = {1/lam/3600:.0f} hr")
    print(f"Grain count @1 kg/s: 500um -> {1/((4/3)*np.pi*(250e-6)**3*rho):.1e}/s, "
          f"beta(500um)={beta(500e-6):.1e} (<<0.5 -> no blowout self-clean)\n")
    print("arrival v | transit |   launch  | RP smear @500um (km) 5/20/50% spread")
    for dCf in [3e-3,1e-3,3e-4,1e-4,3e-5,1e-5]:
        t,va,vl=trajectory(dCf); b=0.5*a_rp(500e-6)*t**2
        print(f"{va:6.0f} m/s |{t/3600:5.0f} hr | {vl/1e3:.3f}km/s | "
              f"{0.05*b/1e3:7.1f} {0.20*b/1e3:7.1f} {0.50*b/1e3:7.1f}")
    t_op,va_op,_=trajectory(1e-4)
    print(f"\nCollector radius for eta=0.999 @ op point ({va_op:.0f} m/s, {t_op/3600:.0f} hr):")
    for rmed,spread,theta in [(500,0.50,30),(500,0.20,10),(500,0.05,3),
                              (1000,0.05,3),(2000,0.02,1)]:
        print(f"  {rmed:>4}um {spread:>4.0%} spread, {theta:>2}\" point -> "
              f"Rc = {Rc_need(0.999,rmed,spread,theta,t_op)/1e3:6.1f} km "
              f"(escaped 0.1% = 32 t/yr @1 kg/s)")
    print("\nShort-baseline throw (driver staged near point), 500um/20%/10\":")
    for bkm,vt in [(2000,200),(5000,300),(10000,500)]:
        t=bkm*1e3/vt
        print(f"  {bkm:>6} km @ {vt} m/s: {t/3600:.1f} hr, "
              f"RP smear {0.2*0.5*a_rp(500e-6)*t**2/1e3:.2f} km, "
              f"Rc(.999) = {Rc_need(0.999,500,0.20,10,t)/1e3:.1f} km")
