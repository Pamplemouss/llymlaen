# main.tf

terraform {
  required_providers {
    scaleway = {
      source = "scaleway/scaleway"
    }
  }
  required_version = ">= 0.13"
}

variable "access_key" {
  type = string
  sensitive = true
}
variable "secret_key" {
  type = string
  sensitive = true
}
variable "organization_id" {
  type = string
  sensitive = true
}
variable "project_id" {
  type = string
  sensitive = true
}

provider "scaleway" {
  access_key      = var.access_key
  secret_key      = var.secret_key
  organization_id = var.organization_id
  project_id      = var.project_id
  zone   = "fr-par-2"
  region = "fr-par"
}

resource "scaleway_instance_ip" "public_ip" {
  project_id = var.project_id
}

resource "scaleway_instance_security_group" "www" {
  project_id              = var.project_id
  inbound_default_policy  = "drop"
  outbound_default_policy = "accept"

  inbound_rule {
    action   = "accept"
    port     = "22"
    ip_range = "0.0.0.0/0"
  }

  inbound_rule {
    action = "accept"
    port   = "80"
  }

  inbound_rule {
    action = "accept"
    port   = "443"
  }

  inbound_rule {
    action = "accept"
    port   = "53"
  }

  inbound_rule {
    action = "accept"
    port   = "6443"
  }
}

resource "scaleway_instance_server" "web" {
  project_id = var.project_id
  type       = "DEV1-M"
  image      = "ubuntu_jammy"

  tags = ["front", "web"]

  ip_id = scaleway_instance_ip.public_ip.id

  root_volume {
   size_in_gb = 10
  }

  security_group_id = scaleway_instance_security_group.www.id
}
