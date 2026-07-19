"""Power database model."""

from sqlalchemy import Column, String, Integer, ForeignKey, Float

from app.models.base import Base, BaseModel


class Power(Base, BaseModel):
    """Power model for power supply and consumption data."""

    __tablename__ = "power"

    id = Column(Integer, primary_key=True, index=True)
    bmc_system_id = Column(Integer, ForeignKey("bmc_systems.id"), nullable=False)
    power_supply_name = Column(String(255), nullable=False)
    status = Column(String(50), default="ok", nullable=False)
    input_voltage = Column(Float, nullable=True)
    output_voltage = Column(Float, nullable=True)
    power_output_watts = Column(Float, nullable=True)
    efficiency_percent = Column(Float, nullable=True)
    temperature_c = Column(Float, nullable=True)
    model = Column(String(255), nullable=True)
    serial_number = Column(String(100), nullable=True)

    def __repr__(self) -> str:
        return f"<Power(id={self.id}, name={self.power_supply_name})>"