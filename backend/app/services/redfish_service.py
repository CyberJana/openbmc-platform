"""Redfish API client service."""

import logging
import time
from typing import Optional, Dict, Any
from urllib.parse import urljoin

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

from app.core.config import settings

logger = logging.getLogger(__name__)


class RedfishClient:
    """Redfish API client for communicating with BMC systems."""

    def __init__(
        self,
        host: str,
        username: str,
        password: str,
        port: int = 443,
        verify_ssl: bool = False,
        timeout: int = 30,
        retries: int = 3,
        retry_delay: int = 1,
    ):
        """Initialize Redfish client."""
        self.host = host
        self.port = port
        self.username = username
        self.password = password
        self.verify_ssl = verify_ssl
        self.timeout = timeout
        self.retries = retries
        self.retry_delay = retry_delay
        self.base_url = f"https://{host}:{port}/redfish/v1"
        self.session = None
        self.auth_token = None
        self._init_session()

    def _init_session(self) -> None:
        """Initialize HTTP session with retry strategy."""
        self.session = requests.Session()
        retry_strategy = Retry(
            total=self.retries,
            backoff_factor=self.retry_delay,
            status_forcelist=[429, 500, 502, 503, 504],
        )
        adapter = HTTPAdapter(max_retries=retry_strategy)
        self.session.mount("http://", adapter)
        self.session.mount("https://", adapter)
        self.session.verify = self.verify_ssl
        self.session.headers.update({"Content-Type": "application/json"})

    def authenticate(self) -> bool:
        """Authenticate with BMC using Redfish API."""
        try:
            auth_url = urljoin(self.base_url, "/SessionService/Sessions")
            payload = {"UserName": self.username, "Password": self.password}
            response = self.session.post(
                auth_url,
                json=payload,
                timeout=self.timeout,
            )
            response.raise_for_status()
            self.auth_token = response.headers.get("X-Auth-Token")
            self.session.headers.update({"X-Auth-Token": self.auth_token})
            logger.info(f"Successfully authenticated with {self.host}")
            return True
        except Exception as e:
            logger.error(f"Authentication failed: {e}")
            return False

    def get(self, endpoint: str) -> Optional[Dict[str, Any]]:
        """Perform GET request to Redfish endpoint."""
        try:
            url = urljoin(self.base_url, endpoint)
            response = self.session.get(url, timeout=self.timeout)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"GET request failed for {endpoint}: {e}")
            return None

    def post(
        self, endpoint: str, payload: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        """Perform POST request to Redfish endpoint."""
        try:
            url = urljoin(self.base_url, endpoint)
            response = self.session.post(
                url, json=payload, timeout=self.timeout
            )
            response.raise_for_status()
            return response.json() if response.content else {}
        except Exception as e:
            logger.error(f"POST request failed for {endpoint}: {e}")
            return None

    def patch(
        self, endpoint: str, payload: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        """Perform PATCH request to Redfish endpoint."""
        try:
            url = urljoin(self.base_url, endpoint)
            response = self.session.patch(
                url, json=payload, timeout=self.timeout
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"PATCH request failed for {endpoint}: {e}")
            return None

    def delete(self, endpoint: str) -> bool:
        """Perform DELETE request to Redfish endpoint."""
        try:
            url = urljoin(self.base_url, endpoint)
            response = self.session.delete(url, timeout=self.timeout)
            response.raise_for_status()
            return True
        except Exception as e:
            logger.error(f"DELETE request failed for {endpoint}: {e}")
            return False

    def get_service_root(self) -> Optional[Dict[str, Any]]:
        """Get Redfish service root."""
        return self.get("/")

    def get_systems(self) -> Optional[Dict[str, Any]]:
        """Get computer systems."""
        return self.get("/Systems")

    def get_chassis(self) -> Optional[Dict[str, Any]]:
        """Get chassis."""
        return self.get("/Chassis")

    def get_managers(self) -> Optional[Dict[str, Any]]:
        """Get managers."""
        return self.get("/Managers")

    def get_system_health(self, system_id: str = "1") -> Optional[Dict[str, Any]]:
        """Get system health status."""
        return self.get(f"/Systems/{system_id}")

    def get_thermal(self, chassis_id: str = "1") -> Optional[Dict[str, Any]]:
        """Get thermal information."""
        return self.get(f"/Chassis/{chassis_id}/Thermal")

    def get_power(self, chassis_id: str = "1") -> Optional[Dict[str, Any]]:
        """Get power information."""
        return self.get(f"/Chassis/{chassis_id}/Power")

    def get_sensors(self, chassis_id: str = "1") -> Optional[Dict[str, Any]]:
        """Get sensors."""
        return self.get(f"/Chassis/{chassis_id}/Sensors")

    def get_storage(self, system_id: str = "1") -> Optional[Dict[str, Any]]:
        """Get storage information."""
        return self.get(f"/Systems/{system_id}/Storage")

    def get_network_interfaces(self, system_id: str = "1") -> Optional[Dict[str, Any]]:
        """Get network interfaces."""
        return self.get(f"/Systems/{system_id}/EthernetInterfaces")

    def close(self) -> None:
        """Close session."""
        if self.session:
            self.session.close()