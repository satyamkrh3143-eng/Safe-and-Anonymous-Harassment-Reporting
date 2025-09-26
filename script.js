
const complaintForm = document.getElementById('complaintForm');
const description = document.getElementById('description');
const charCount = document.getElementById('charCount');
const anonymousCheckbox = document.getElementById('anonymous');
const contactSection = document.getElementById('contactSection');
const fileInput = document.getElementById('fileInput');
const fileUploadArea = document.getElementById('fileUploadArea');
const fileList = document.getElementById('fileList');
const photoPreview = document.getElementById('photoPreview');
const previewGrid = document.getElementById('previewGrid');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.querySelector('.nav-links');
const checkStatusBtn = document.getElementById('checkStatusBtn');
const caseIdInput = document.getElementById('caseIdInput');
const statusResult = document.getElementById('statusResult');
const statusDetails = document.getElementById('statusDetails');
const shareThisCase = document.getElementById('shareThisCase');
const photoModal = document.getElementById('photoModal');
const modalImage = document.getElementById('modalImage');
const photoInfo = document.getElementById('photoInfo');
const closePhoto = document.querySelector('.close-photo');

const sampleCases = [
    {
        id: 'HR-2024-001234',
        date: '2024-01-12',
        category: 'Online Harassment',
        status: 'reviewing',
        assignedTo: 'City Cyber Crime Unit',
        evidence: true,
        description: 'Harassing messages received through social media platforms',
        daysAgo: 3
    },
    {
        id: 'HR-2024-001233',
        date: '2024-01-08',
        category: 'Workplace Harassment',
        status: 'escalated',
        assignedTo: 'Women & Child Desk',
        evidence: true,
        description: 'Inappropriate comments and behavior in workplace setting',
        daysAgo: 7
    },
    {
        id: 'HR-2024-001232',
        date: '2024-01-02',
        category: 'Verbal Harassment',
        status: 'closed',
        assignedTo: 'Community Safety Office',
        evidence: false,
        description: 'Verbal abuse in public transportation',
        daysAgo: 14
    }
];


document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {

    loadCaseFromURL();
    
 
    populateCaseCards();
    

    setupNavigation();
    

    setupEventListeners();
}

function setupEventListeners() {
    description.addEventListener('input', updateCharCount);

    anonymousCheckbox.addEventListener('change', toggleContactSection);
    
    mobileMenu.addEventListener('click', toggleMobileMenu);
    setupFileUpload();
    
    
    setupTabs();
    

    checkStatusBtn.addEventListener('click', checkCaseStatus);
    
    closePhoto.addEventListener('click', closePhotoModal);
    photoModal.addEventListener('click', function(e) {
        if (e.target === this) closePhotoModal();
    });
    

    complaintForm.addEventListener('submit', handleFormSubmission);
}

function updateCharCount() {
    const remaining = 300 - this.value.length;
    charCount.textContent = remaining;
    
    if (remaining < 50) {
        charCount.style.color = 'red';
    } else if (remaining < 100) {
        charCount.style.color = 'orange';
    } else {
        charCount.style.color = '#666';
    }
}

function toggleContactSection() {
    contactSection.style.display = this.checked ? 'none' : 'block';
}

function toggleMobileMenu() {
    navLinks.classList.toggle('active');
}

function setupFileUpload() {
    fileUploadArea.addEventListener('click', () => fileInput.click());
    
    fileUploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--primary)';
        this.style.backgroundColor = '#f0f8ff';
    });
    
    fileUploadArea.addEventListener('dragleave', function() {
        this.style.borderColor = '#ddd';
        this.style.backgroundColor = 'transparent';
    });
    
    fileUploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.borderColor = '#ddd';
        this.style.backgroundColor = 'transparent';
        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    });
    
    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });
}

function handleFiles(files) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        

        const validTypes = ['image/jpeg', 'image/png', 'video/mp4', 'audio/mpeg', 'audio/wav', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            alert(`File type not supported: ${file.name}`);
            continue;
        }
        
    
        if (file.size > 50 * 1024 * 1024) {
            alert(`File too large: ${file.name}. Maximum size is 50MB.`);
            continue;
        }
        
        addFileToList(file);

        if (file.type.startsWith('image/')) {
            createImagePreview(file);
        }
    }
    
    fileInput.value = '';
}

function addFileToList(file) {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.innerHTML = `
        <div>
            <strong>${file.name}</strong> (${formatFileSize(file.size)})
        </div>
        <button type="button">Remove</button>
    `;
    
    fileItem.querySelector('button').addEventListener('click', function() {
        fileItem.remove();

        if (file.type.startsWith('image/')) {
            removeImagePreview(file.name);
        }
    });
    
    fileList.appendChild(fileItem);
}

function createImagePreview(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        photoPreview.style.display = 'block';
        
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        previewItem.innerHTML = `
            <img src="${e.target.result}" alt="${file.name}">
            <div class="preview-info">${file.name}</div>
        `;
        
        previewItem.addEventListener('click', function() {
            showPhotoModal(e.target.result, file);
        });
        
        previewGrid.appendChild(previewItem);
    };
    
    reader.readAsDataURL(file);
}

function removeImagePreview(filename) {
    const previewItems = previewGrid.querySelectorAll('.preview-item');
    previewItems.forEach(item => {
        if (item.querySelector('.preview-info').textContent === filename) {
            item.remove();
        }
    });
    
    if (previewGrid.children.length === 0) {
        photoPreview.style.display = 'none';
    }
}

function showPhotoModal(src, file) {
    modalImage.src = src;
    photoInfo.textContent = `${file.name} (${formatFileSize(file.size)})`;
    photoModal.style.display = 'flex';
}

function closePhotoModal() {
    photoModal.style.display = 'none';
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
}

function setupTabs() {
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === 'tab-' + tabId) {
                    content.classList.add('active');
                    filterCasesByStatus(tabId);
                }
            });
        });
    });
}

function populateCaseCards() {
    const allTab = document.getElementById('tab-all');
    allTab.innerHTML = '';
    
    sampleCases.forEach(caseData => {
        allTab.appendChild(createCaseCard(caseData));
    });
}

function filterCasesByStatus(status) {
    const tabContent = document.getElementById('tab-' + status);
    
    if (status === 'all') {
        populateCaseCards();
        return;
    }
    
    tabContent.innerHTML = '';
    
    const filteredCases = sampleCases.filter(caseData => caseData.status === status);
    
    if (filteredCases.length === 0) {
        tabContent.innerHTML = `
            <div class="no-cases">
                <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='%23f8f9fa' stroke='%23dee2e6' stroke-width='2'/><text x='50' y='55' font-family='Arial' font-size='14' text-anchor='middle' fill='%236c757d'>No cases</text></svg>" 
                     alt="No cases">
                <p>No cases with "${status.replace('_', ' ')}" status at the moment.</p>
            </div>
        `;
        return;
    }
    
    filteredCases.forEach(caseData => {
        tabContent.appendChild(createCaseCard(caseData));
    });
}

function createCaseCard(caseData) {
    const card = document.createElement('div');
    card.className = 'case-card';
    card.innerHTML = `
        <div class="case-header">
            <span class="case-id">Case #${caseData.id}</span>
            <span class="status-badge status-${caseData.status}">${caseData.status.replace('_', ' ')}</span>
        </div>
        <p><strong>Category:</strong> ${caseData.category}</p>
        <p><strong>Assigned To:</strong> ${caseData.assignedTo}</p>
        <p><strong>Evidence:</strong> ${caseData.evidence ? 'Provided' : 'Not Provided'}</p>
        <p><strong>Reported:</strong> ${caseData.daysAgo} days ago</p>
        <button class="btn btn-secondary share-case-btn" data-caseid="${caseData.id}">
            <span class="btn-icon">🔗</span>
            Share Case
        </button>
    `;
    
    card.querySelector('.share-case-btn').addEventListener('click', function() {
        shareCase(caseData.id);
    });
    
    return card;
}

function checkCaseStatus() {
    const caseId = caseIdInput.value.trim();
    
    if (!caseId) {
        alert('Please enter a case ID');
        return;
    }
    
    const status = getCaseStatus(caseId);
    
    if (status) {
        statusDetails.innerHTML = `
            <p><strong>Case ID:</strong> ${caseId}</p>
            <p><strong>Status:</strong> <span class="status-badge status-${status.status}">${status.status.replace('_', ' ')}</span></p>
            <p><strong>Last Updated:</strong> ${status.lastUpdated}</p>
            <p><strong>Assigned To:</strong> ${status.assignedTo}</p>
        `;
        
        shareThisCase.onclick = function() {
            shareCase(caseId);
        };
        
        statusResult.style.display = 'block';
    } else {
        statusDetails.innerHTML = '<p>Case not found. Please check your Case ID.</p>';
        statusResult.style.display = 'block';
    }
}

function getCaseStatus(caseId) {
    const caseData = sampleCases.find(case => case.id === caseId);
    if (!caseData) return null;
    
    return {
        status: caseData.status,
        lastUpdated: caseData.date,
        assignedTo: caseData.assignedTo
    };
}

function shareCase(caseId) {
    const shareURL = generateCaseShareURL(caseId);
    showShareModal(caseId, shareURL);
}

function generateCaseShareURL(caseId) {
    const baseURL = window.location.origin + window.location.pathname;
    return `${baseURL}?case=${caseId}&view=public`;
}

function showShareModal(caseId, shareURL) {
    const modal = document.getElementById('shareModal');
    const shareURLInput = document.getElementById('shareURL');
    
    shareURLInput.value = shareURL;
    modal.style.display = 'flex';
    
    generateQRCode(shareURL);
    setupShareListeners(caseId, shareURL);
}

function generateQRCode(url) {
    const canvas = document.getElementById('qrCode');
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    
    ctx.fillStyle = 'black';
    const data = url + '|' + new Date().getTime();
    
    for (let i = 0; i < data.length; i++) {
        const charCode = data.charCodeAt(i);
        const x = (i * 7) % (canvas.width - 5);
        const y = Math.floor((i * 7) / (canvas.width - 5)) * 5;
        
        if (charCode % 3 === 0) {
            ctx.fillRect(x, y, 4, 4);
        }
    }
}

function setupShareListeners(caseId, shareURL) {
    document.getElementById('copyURL').onclick = function() {
        navigator.clipboard.writeText(shareURL).then(() => {
            const originalText = this.textContent;
            this.textContent = 'Copied!';
            setTimeout(() => this.textContent = originalText, 2000);
        });
    };
    
    document.getElementById('shareWhatsApp').onclick = function() {
        window.open(`https://wa.me/?text=${encodeURIComponent(`View this harassment case report: ${shareURL}`)}`, '_blank');
    };
    
    document.getElementById('shareEmail').onclick = function() {
        window.open(`mailto:?subject=${encodeURIComponent(`Harassment Case ${caseId}`)}&body=${encodeURIComponent(`I want to share this harassment case with you. No private information is included.\n\nView case: ${shareURL}`)}`);
    };
    
    document.getElementById('shareSMS').onclick = function() {
        window.open(`sms:?body=${encodeURIComponent(`View harassment case: ${shareURL}`)}`);
    };
    
    document.getElementById('closeModal').onclick = function() {
        document.getElementById('shareModal').style.display = 'none';
    };
}

function loadCaseFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const caseId = urlParams.get('case');
    const view = urlParams.get('view');
    
    if (caseId && view === 'public') {
        document.getElementById('cases').scrollIntoView({ behavior: 'smooth' });
        
        const caseElements = document.querySelectorAll('.case-id');
        caseElements.forEach(element => {
            if (element.textContent.includes(caseId)) {
                const caseCard = element.closest('.case-card');
                caseCard.style.border = '2px solid var(--accent)';
                caseCard.style.boxShadow = '0 0 10px rgba(229, 75, 75, 0.3)';
                
                const status = caseCard.querySelector('.status-badge').textContent.toLowerCase().replace(' ', '_');
                const tab = document.querySelector(`.tab[data-tab="${status}"]`);
                if (tab) tab.click();
            }
        });
    }
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    if (!document.getElementById('consent').checked) {
        alert('You must consent to how your data will be used and protected.');
        return;
    }
    
    const incidentDate = new Date(document.getElementById('incidentDate').value);
    const now = new Date();
    if (incidentDate > now) {
        alert('Incident date cannot be in the future.');
        return;
    }
    
    const caseId = 'HR-' + new Date().getFullYear() + '-' + Math.random().toString().substr(2, 6);
    
    alert(`Report submitted successfully!\n\nYour case ID is: ${caseId}\n\nPlease save this ID to check your case status.`);
    
    complaintForm.reset();
    fileList.innerHTML = '';
    previewGrid.innerHTML = '';
    photoPreview.style.display = 'none';
    contactSection.style.display = 'none';
    charCount.textContent = '300';
    charCount.style.color = '#666';
    
    caseIdInput.value = caseId;
}

function setupNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                navLinks.classList.remove('active');
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}