"""Network interface database model."""

from sqlalchemy import Column, String, Integer, ForeignKey, Boolean

from app.models.base import Base, BaseModel


class NetworkInterface(Base, BaseModel):
    """Network interface model."""

    __tablename__ = "network_interfaces"

    id = Column(Integer, primary_key=True, index=True)
    bmc_system_id = Column(Integer, ForeignKey("bmc_systems.id"), nullable=False)
    name = Column(String(100), nullable=False)
    mac_address = Column(String(50), nullable=False)
    ipv4_address = Column(String(50), nullable=True)
    ipv6_address = Column(String(100), nullable=True)
    speed_mbps = Column(Integer, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    link_status = Column(String(20), nullable=True)
    mtu = Column(Integer, default=1500, nullable=False)

    def __repr__(self) -> str:
        return f"<NetworkInterface(id={self.id}, name={self.name})>"