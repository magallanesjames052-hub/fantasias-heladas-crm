/* Fantasías Heladas CRM — capa de acceso a datos (localStorage) */

const Store = {
  getAll() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  saveAll(leads) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  },

  getById(id) {
    return this.getAll().find((l) => l.id === Number(id));
  },

  create(lead) {
    const leads = this.getAll();
    const nextId = leads.length ? Math.max(...leads.map((l) => l.id)) + 1 : 1;
    const nuevo = {
      id: nextId,
      fecha: new Date().toISOString().slice(0, 10),
      cliente: lead.cliente,
      empresa: lead.empresa || "Particular",
      telefono: lead.telefono || "",
      producto: lead.producto || PRODUCTOS[0],
      valorUsd: Number(lead.valorUsd) || 0,
      estado: lead.estado || "Nuevo Lead",
      fuente: lead.fuente || FUENTES[0],
      prioridad: lead.prioridad || "Media",
      notas: lead.notas || "",
      fechaSeguimiento: lead.fechaSeguimiento || "",
    };
    leads.push(nuevo);
    this.saveAll(leads);
    return nuevo;
  },

  update(id, cambios) {
    const leads = this.getAll();
    const idx = leads.findIndex((l) => l.id === Number(id));
    if (idx === -1) return null;
    leads[idx] = {
      ...leads[idx],
      ...cambios,
      valorUsd: cambios.valorUsd !== undefined ? Number(cambios.valorUsd) : leads[idx].valorUsd,
    };
    this.saveAll(leads);
    return leads[idx];
  },

  remove(id) {
    const leads = this.getAll().filter((l) => l.id !== Number(id));
    this.saveAll(leads);
  },

  stats() {
    const leads = this.getAll();
    const total = leads.length;
    const ganados = leads.filter((l) => l.estado === "Ganado");
    const perdidos = leads.filter((l) => l.estado === "Perdido");
    const abiertos = leads.filter((l) => l.estado !== "Ganado" && l.estado !== "Perdido");

    const valorPipeline = abiertos.reduce((sum, l) => sum + l.valorUsd, 0);
    const valorGanado = ganados.reduce((sum, l) => sum + l.valorUsd, 0);
    const tasaConversion = ganados.length || perdidos.length
      ? (ganados.length / (ganados.length + perdidos.length)) * 100
      : 0;

    return {
      total,
      abiertos: abiertos.length,
      ganados: ganados.length,
      perdidos: perdidos.length,
      valorPipeline,
      valorGanado,
      tasaConversion,
    };
  },

  funnelPorEstado() {
    const leads = this.getAll();
    return ESTADOS.map((estado) => ({
      estado,
      cantidad: leads.filter((l) => l.estado === estado).length,
      valor: leads.filter((l) => l.estado === estado).reduce((s, l) => s + l.valorUsd, 0),
    }));
  },

  porFuente() {
    const leads = this.getAll();
    return FUENTES.map((fuente) => ({
      fuente,
      cantidad: leads.filter((l) => l.fuente === fuente).length,
    })).filter((f) => f.cantidad > 0);
  },

  porProducto() {
    const leads = this.getAll();
    return PRODUCTOS.map((producto) => ({
      producto,
      cantidad: leads.filter((l) => l.producto === producto).length,
      valor: leads.filter((l) => l.producto === producto).reduce((s, l) => s + l.valorUsd, 0),
    }));
  },

  porMes() {
    const leads = this.getAll();
    const meses = {};
    leads.forEach((l) => {
      const mes = l.fecha.slice(0, 7); // YYYY-MM
      meses[mes] = (meses[mes] || 0) + 1;
    });
    return Object.keys(meses)
      .sort()
      .slice(-6)
      .map((mes) => ({ mes, cantidad: meses[mes] }));
  },

  pipelinePorEstado() {
    const leads = this.getAll();
    return ESTADOS.map((estado) => ({
      estado,
      leads: leads.filter((l) => l.estado === estado).sort((a, b) => b.fecha.localeCompare(a.fecha)),
    }));
  },

  fuentesDetalle() {
    const leads = this.getAll();
    return FUENTES.map((fuente) => {
      const deFuente = leads.filter((l) => l.fuente === fuente);
      const ganados = deFuente.filter((l) => l.estado === "Ganado");
      const perdidos = deFuente.filter((l) => l.estado === "Perdido");
      const valorGanado = ganados.reduce((s, l) => s + l.valorUsd, 0);
      const tasaConversion = ganados.length || perdidos.length
        ? (ganados.length / (ganados.length + perdidos.length)) * 100
        : 0;
      return {
        fuente,
        cantidad: deFuente.length,
        ganados: ganados.length,
        valorGanado,
        tasaConversion,
      };
    }).filter((f) => f.cantidad > 0);
  },

  seguimientos() {
    const hoy = new Date().toISOString().slice(0, 10);
    return this.getAll()
      .filter((l) => l.fechaSeguimiento && l.estado !== "Ganado" && l.estado !== "Perdido")
      .map((l) => ({ ...l, vencido: l.fechaSeguimiento < hoy }))
      .sort((a, b) => a.fechaSeguimiento.localeCompare(b.fechaSeguimiento));
  },
};
