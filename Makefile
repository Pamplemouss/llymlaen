.PHONY: terraform install update uninstall restart destroy

terraform:
	terraform apply

install:
	ssh root@${SSH_IP} "curl -sfL https://get.k3s.io | sh -s - --tls-san eorguessr.com --tls-san www.eorguessr.com"
	ssh root@${SSH_IP} "ufw disable"
	ssh root@${SSH_IP} "cat /etc/rancher/k3s/k3s.yaml" > ~/.kube/config
	sed -i '' 's:127.0.0.1:${SSH_IP}:g' ~/.kube/config
	kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.10.1/cert-manager.yaml

build:
	docker build --platform linux/amd64 -t pampalamos/eorguessr .
	docker push pampalamos/eorguessr

update:
	kubectl apply -f ./ops/deployments/namespace.yaml
	kubectl apply -f ./ops/deployments/api.yaml
	kubectl apply -f ./ops/deployments/ingress.yaml
	kubectl apply -f ./ops/deployments/letsencrypt-issuer-prod.yaml

uninstall:
	ssh root@${SSH_IP} "/usr/local/bin/k3s-uninstall.sh"

restart:
	ssh root@${SSH_IP} "k3s-killall.sh"
	ssh root@${SSH_IP} "systemctl restart k3s"
	
destroy:
	terraform destroy
	