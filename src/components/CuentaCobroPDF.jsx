import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from "../assets/logo.png";

const PALETTE = {
  bg: "#f5f7fa",
  block: "#ffffff",
  border: "#e3e7fa",
  primary: "#273146",
  secondary: "#595e93",
  accent: "#1eae98",
  muted: "#7f83b5",
  gray: "#adb4cc",
  strong: "#29c4a9",
  badge: "#6846b1"
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    padding: 36,
    fontSize: 12,
    backgroundColor: PALETTE.bg,
    color: PALETTE.primary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottom: `2 solid ${PALETTE.primary}`,
    paddingBottom: 14,
    marginBottom: 20,
  },
  leftHeader: {
    flex: 1.2,
    minWidth: 180,
  },
  rightHeader: {
    flex: 0.8,
    alignItems: "flex-end",
  },
  companyBlock: {
    fontSize: 18,
    fontWeight: 900,
    color: PALETTE.primary,
    marginBottom: 3,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  companyNit: {
    color: PALETTE.strong,
    fontSize: 10,
    marginBottom: 1,
  },
  docTitle: {
    fontSize: 22,
    fontWeight: 900,
    color: PALETTE.badge,
    letterSpacing: 2,
    marginBottom: 4,
    textAlign: "right",
    textTransform: "uppercase",
  },
  docNumber: {
    color: PALETTE.primary,
    fontSize: 11,
    fontWeight: 600,
    textAlign: "right",
    marginBottom: 1,
  },
  section: {
    backgroundColor: PALETTE.block,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    border: `1 solid ${PALETTE.border}`,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 2,
  },
  gridCol: {
    flex: 1,
    minWidth: "50%",
    marginBottom: 1,
  },
  label: {
    color: PALETTE.secondary,
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 1,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  value: {
    color: PALETTE.primary,
    fontWeight: 600,
    fontSize: 13,
    marginBottom: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  table: {
    marginTop: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: PALETTE.gray,
    borderRadius: 4,
    paddingVertical: 5,
    fontWeight: 700,
    fontSize: 12,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: `1 solid ${PALETTE.border}`,
    paddingVertical: 4,
  },
  cellHead: {
    color: "#fff",
    fontWeight: 700,
    fontSize: 11,
    flex: 1,
    textAlign: "center",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    color: PALETTE.primary,
    fontSize: 11,
  },
  cellDesc: {
    flex: 2,
    textAlign: "left",
    paddingLeft: 5,
  },
  totals: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 12,
    alignItems: "center",
  },
  totalLabel: {
    color: PALETTE.muted,
    fontSize: 13,
    fontWeight: 600,
    marginRight: 7,
    marginTop: 2,
  },
  totalValue: {
    color: PALETTE.accent,
    fontSize: 17,
    fontWeight: 900,
  },
  subtotalValue: {
    color: PALETTE.primary,
    fontSize: 12,
    fontWeight: 700,
    marginTop: 2,
  },
  bankBlock: {
    backgroundColor: "#eef6ff",
    borderRadius: 10,
    padding: 13,
    marginTop: 10,
    marginBottom: 5,
    border: `1 solid ${PALETTE.border}`,
  },
  notaSection: {
    backgroundColor: "#f8fafb",
    borderRadius: 8,
    border: `1 solid ${PALETTE.border}`,
    padding: 10,
    marginTop: 6,
    marginBottom: 4,
  },
  legal: {
    fontSize: 10,
    color: PALETTE.gray,
    marginTop: 14,
    marginBottom: 8,
    textAlign: "justify"
  },
  recibido: {
    fontSize: 12,
    color: PALETTE.primary,
    marginTop: 22,
    marginBottom: 1,
    textAlign: "left",
    fontWeight: 700,
    letterSpacing: 1.1,
  },
  signature: {
    marginTop: 18,
    borderTop: `1 solid ${PALETTE.border}`,
    textAlign: "center",
    paddingTop: 8,
    fontSize: 13,
    color: PALETTE.secondary,
    fontWeight: 700,
    letterSpacing: 1.3,
  },
  logo: {
    width: 120,
    height: 52,
    marginBottom: 8,
    objectFit: "contain"
  }
});

export default function CuentaCobroPDF({ data }) {
  const {
    nroCuenta,
    fecha,
    clienteNombre,
    clienteEmpresa,
    clienteNIT,
    clienteDireccion,
    clienteTelefono,
    clienteCiudad,
    correo,
    items = [],
    banco,
    cuentaBancaria,
    emisorNombre,
    emisorNIT,
    emisorDireccion,
    emisorTelefono,
    regimen,
    subtotal,
    total,
    notas = "Para cualquier consulta relacionada con este documento, puede comunicarse con el emisor al 3103997817.",
    mensajeLegal,
  } = data;

  const _emisorNombre = emisorNombre || "ANGEL DARIO ALVAREZ PARRA";
  const _emisorNIT = emisorNIT || "98.636.763";
  const _emisorDireccion = emisorDireccion || "CR 50A 73 A 48 APTO 401";
  const _emisorTelefono = emisorTelefono || "3103997817";
  const _regimen = regimen || "Simplificado";
  const _banco = banco || "Bancolombia";
  const _cuentaBancaria = cuentaBancaria || "230-000443-42";
  const _mensajeLegal =
    mensajeLegal ||
    "Dando cumplimiento al decreto 2231, artículo 9, manifiesto bajo gravedad de juramento que durante el año 2024 no tomaré costos y gastos asociados a dicha renta. Por lo tanto, aplicar el artículo 383 ET.";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.leftHeader}>
            <Image src={logo} style={styles.logo} />
            <Text style={styles.companyBlock}>{_emisorNombre}</Text>
            <Text style={styles.companyNit}>NIT: {_emisorNIT}</Text>
            <Text style={{ color: PALETTE.primary, fontSize: 10 }}>
              {_emisorDireccion} | Tel: {_emisorTelefono}
            </Text>
            <Text style={{ color: PALETTE.muted, fontSize: 10, marginTop: 2 }}>
              Régimen: {_regimen}
            </Text>
          </View>
          <View style={styles.rightHeader}>
            <Text style={styles.docTitle}>CUENTA DE COBRO</Text>
            <Text style={styles.docNumber}>DOCUMENTO EQUIVALENTE N° {nroCuenta}</Text>
            <Text style={{ color: PALETTE.primary, fontSize: 11, marginTop: 6 }}>
              Fecha: {fecha}
            </Text>
          </View>
        </View>

        {/* CLIENTE */}
        <View style={styles.section}>
          <Text style={styles.label}>Datos del Cliente</Text>
          <View style={styles.grid}>
            <View style={styles.gridCol}>
              <Text style={styles.value}>{clienteNombre} {clienteEmpresa && `- ${clienteEmpresa}`}</Text>
              <Text style={{ color: PALETTE.muted, fontSize: 11 }}>NIT: {clienteNIT}</Text>
              <Text style={{ color: PALETTE.muted, fontSize: 11 }}>Tel: {clienteTelefono}</Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={{ color: PALETTE.muted, fontSize: 11 }}>Dirección: {clienteDireccion}</Text>
              <Text style={{ color: PALETTE.muted, fontSize: 11 }}>Ciudad: {clienteCiudad}</Text>
              <Text style={{ color: PALETTE.muted, fontSize: 11 }}>Correo: {correo}</Text>
            </View>
          </View>
        </View>

        {/* TABLA SERVICIOS / ITEMS */}
        <View style={styles.section}>
          <Text style={styles.label}>Recorridos y Servicios Realizados</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.cellHead}>Cant</Text>
              <Text style={[styles.cellHead, styles.cellDesc]}>Descripción</Text>
              <Text style={styles.cellHead}>Unitario</Text>
              <Text style={styles.cellHead}>Total</Text>
            </View>
            {items.map((item, idx) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={styles.cell}>{item.cantidad}</Text>
                <Text style={[styles.cell, styles.cellDesc]}>
                  {item.descripcion}
                  {/* Si tiene fecha, la muestra */}
                  {item.fechaItem && (
                    <Text style={{ fontSize: 9, color: "#888", display: "block", marginTop: 2 }}>
                      {` (${item.fechaItem})`}
                    </Text>
                  )}
                </Text>
                <Text style={styles.cell}>${parseFloat(item.valorUnitario || 0).toLocaleString()}</Text>
                <Text style={styles.cell}>${parseFloat(item.valorTotal || 0).toLocaleString()}</Text>
              </View>
            ))}

          </View>
          <View style={styles.totals}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.subtotalValue}>${parseFloat(subtotal || 0).toLocaleString()}</Text>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>${parseFloat(total || 0).toLocaleString()}</Text>
          </View>
        </View>

        {/* DATOS BANCARIOS */}
        <View style={styles.bankBlock}>
          <Text style={[styles.label, { marginBottom: 2 }]}>Pago o consignación</Text>
          <Text style={{ color: PALETTE.primary, fontSize: 12, fontWeight: 700 }}>
            Banco: {_banco}
          </Text>
          <Text style={{ color: PALETTE.primary, fontSize: 12 }}>
            Cuenta Ahorros N° <Text style={{ fontWeight: 700 }}>{_cuentaBancaria}</Text>
          </Text>
        </View>

        {/* NOTAS / OBSERVACIONES */}
        <View style={styles.notaSection}>
          <Text style={styles.label}>Observaciones</Text>
          <Text style={{ color: PALETTE.primary, fontSize: 10 }}>{notas}</Text>
        </View>

        {/* MENSAJE LEGAL */}
        <Text style={styles.legal}>{_mensajeLegal}</Text>

        {/* RECIBIDO / FIRMA */}
        <Text style={styles.recibido}>Recibido ______________________</Text>
        <Text style={styles.recibido}>Atentamente,</Text>
        <Text style={styles.signature}>{_emisorNombre}</Text>
      </Page>
    </Document>
  );
}
