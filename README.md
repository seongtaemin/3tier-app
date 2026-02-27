# 🚀 3-Tier App GitOps Deployment Guide

이 문서는 신규 환경에 ArgoCD와 Jenkins를 배포하고, Credential 설정부터 파이프라인 연동까지의 전 과정을 설명합니다.

## 📋 사전 준비
- Kubernetes 클러스터 접근 권한 (kubeconfig)
- GitHub 계정 및 Personal Access Token (PAT)
- Harbor 이미지 레지스트리 계정

---

## 1. 네임스페이스 및 기본 설정
도구별로 독립된 환경을 구성합니다.
```bash
kubectl create namespace argocd
kubectl create namespace jenkins
kubectl create namespace 3tier-app-40
# Istio 사이드카 자동 주입 활성화
kubectl label namespace 3tier-app-40 istio-injection=enabled
```

---

## 2. ArgoCD 설치 및 설정 (CD)

### 2.1 설치
```bash
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

### 2.2 외부 접속 (NodePort 설정 예시)
```bash
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "NodePort"}}'
```

### 2.3 저장소 연결 및 애플리케이션 생성
1. ArgoCD UI 접속 후 `Settings > Repositories`에서 GitHub URL 등록
2. `New App` 클릭하여 설정:
   - **Application Name**: `3tier-app`
   - **Source**: `https://github.com/seongtaemin/3tier-app.git` (Path: `.`)
   - **Destination**: `3tier-app-40` 네임스페이스
   - **Sync Policy**: `Automatic`

---

## 3. Jenkins 설치 및 자격 증명(Credential) 설정 (CI)

### 3.1 Jenkins 배포
기본 제공되는 `Jenkinsfile-kube` 또는 Helm 차트를 사용하여 `jenkins` 네임스페이스에 배포합니다.

### 3.2 필수 Credential 생성 (Jenkins UI)
`Manage Jenkins > Credentials > System > Global credentials`에서 다음 항목을 생성합니다.

| ID | 종류 | 설명 |
|---|---|---|
| `github-token` | Username with password | GitHub ID와 PAT (이미지 태그 업데이트 및 커밋용) |
| `harbor-credentials` | Username with password | Harbor 계정 정보 (이미지 푸시용) |
| `kube-config` | Secret file / Text | 타겟 클러스터의 kubeconfig (필요 시) |

### 3.3 Kubernetes Secret 생성 (App용)
애플리케이션이 Harbor에서 이미지를 가져올 수 있도록 `3tier-app-40` 네임스페이스에 Secret을 생성합니다.
```bash
kubectl create secret docker-registry harbor-credentials \
  --docker-server=harbor.kolon.local \
  --docker-username=<USER_ID> \
  --docker-password=<PASSWORD> \
  --docker-email=<EMAIL> \
  -n 3tier-app-40
```

---

## 4. 파이프라인 구성 및 흐름

### 4.1 Jenkins Pipeline Job 생성
- **Definition**: Pipeline script from SCM
- **SCM**: Git
- **Repository URL**: `fastcampus-jenkins` 레포지토리 주소
- **Script Path**: `Jenkinsfile-3tier`

### 4.2 자동화 워크플로우
1. **Developer**: 소스 코드(JSP, Java 등) 수정 후 GitHub에 `Push`
2. **Jenkins**: Webhook 감지 후 빌드 시작
   - Docker 이미지 빌드 및 Harbor 푸시 (`harbor-credentials` 사용)
   - `3tier-app` 레포지토리의 `web.yaml`, `was.yaml` 내 이미지 태그 업데이트 (`github-token` 사용)
   - 변경된 YAML을 GitHub에 `Commit & Push`
3. **ArgoCD**: GitHub의 YAML 변경 감지 후 클러스터에 자동 반영 (`Sync`)
4. **Result**: 대시보드에서 업데이트된 Pod 정보와 디자인 확인

---

## 💡 주요 설정 팁 (현재 프로젝트 최적화)
- **메타데이터 사이드카**: `db.yaml`의 `initContainer`와 `metadata-sidecar` 설정이 포함되어야 대시보드에서 DB 파드 이름이 정상 출력됩니다.
- **Headless Service**: DB 서비스의 `clusterIP: None` 설정을 유지하여 파드 개별 IP 조회가 가능하도록 합니다.
- **Istio mTLS**: `istio-peerauthentication.yaml`이 적용되어 있어야 전체 티어 간 보안 통신이 활성화됩니다.
