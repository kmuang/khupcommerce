document.addEventListener('DOMContentLoaded', function () {
    // Revenue Chart Initialization
    const ctx = document.getElementById('revenueChart').getContext('2d');

    // Create beautiful gradients
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(79, 70, 229, 0.3)');
    gradient.addColorStop(0.5, 'rgba(79, 70, 229, 0.15)');
    gradient.addColorStop(1, 'rgba(79, 70, 229, 0)');

    const gradient2 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient2.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
    gradient2.addColorStop(0.5, 'rgba(16, 185, 129, 0.15)');
    gradient2.addColorStop(1, 'rgba(16, 185, 129, 0)');

    const revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Current Week',
                data: [2400, 3200, 2800, 3800, 3200, 4200, 3800],
                borderColor: '#3b82f6',
                backgroundColor: gradient,
                borderWidth: window.innerWidth <= 480 ? 2 : 3,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#3b82f6',
                pointBorderWidth: window.innerWidth <= 480 ? 2 : 3,
                pointRadius: window.innerWidth <= 480 ? 4 : 6,
                pointHoverRadius: window.innerWidth <= 480 ? 6 : 8,
                pointHoverBorderWidth: window.innerWidth <= 480 ? 3 : 4,
                fill: true,
                tension: 0.4
            },
            {
                label: 'Previous Week',
                data: [1800, 2400, 2100, 2900, 2500, 3400, 3000],
                borderColor: '#10b981',
                backgroundColor: gradient2,
                borderWidth: window.innerWidth <= 480 ? 1.5 : 2,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#10b981',
                pointBorderWidth: window.innerWidth <= 480 ? 1.5 : 2,
                pointRadius: window.innerWidth <= 480 ? 3 : 5,
                pointHoverRadius: window.innerWidth <= 480 ? 5 : 7,
                pointHoverBorderWidth: window.innerWidth <= 480 ? 2 : 3,
                fill: true,
                tension: 0.4,
                borderDash: [5, 5]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: true,
                    position: window.innerWidth <= 480 ? 'bottom' : 'top',
                    align: window.innerWidth <= 480 ? 'center' : 'end',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: window.innerWidth <= 480 ? 10 : 15,
                        font: {
                            family: 'Inter',
                            size: window.innerWidth <= 480 ? 11 : 12,
                            weight: '500'
                        },
                        color: '#64748b',
                        boxWidth: window.innerWidth <= 480 ? 30 : 40
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    padding: 16,
                    titleFont: {
                        size: 14,
                        family: 'Inter',
                        weight: '600'
                    },
                    bodyFont: {
                        size: 13,
                        family: 'Inter'
                    },
                    bodySpacing: 8,
                    cornerRadius: 8,
                    displayColors: true,
                    boxPadding: 6,
                    usePointStyle: true,
                    callbacks: {
                        label: function (context) {
                            return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                        },
                        afterLabel: function(context) {
                            if (context.datasetIndex === 0 && context.parsed.y > 0) {
                                const prevValue = context.chart.data.datasets[1].data[context.dataIndex];
                                const change = ((context.parsed.y - prevValue) / prevValue * 100).toFixed(1);
                                return change > 0 ? '↑ +' + change + '% from last week' : '↓ ' + change + '% from last week';
                            }
                            return '';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(148, 163, 184, 0.1)',
                        drawBorder: false,
                        lineWidth: 1
                    },
                    border: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Inter',
                            size: window.innerWidth <= 480 ? 10 : 12,
                            weight: '500'
                        },
                        color: '#64748b',
                        padding: window.innerWidth <= 480 ? 5 : 10,
                        callback: function (value) {
                            return '$' + (value / 1000) + 'k';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    border: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Inter',
                            size: window.innerWidth <= 480 ? 10 : 12,
                            weight: '500'
                        },
                        color: '#64748b',
                        padding: 10
                    }
                }
            }
        }
    });

    // Add simple interactivity for navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            // Only prevent default if it's a # link
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                
                // Don't handle logout button
                if (this.classList.contains('logout')) {
                    return;
                }
                
                // Get the page to show
                const pageId = this.getAttribute('data-page');
                
                if (pageId) {
                    // Remove active class from all nav items
                    navItems.forEach(nav => nav.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Hide all pages
                    document.querySelectorAll('.page-content').forEach(page => {
                        page.classList.remove('active');
                    });
                    
                    // Show selected page
                    const targetPage = document.getElementById(pageId + '-page');
                    if (targetPage) {
                        targetPage.classList.add('active');
                    }
                }

                // Close sidebar on mobile when item is clicked
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('open');
                    overlay.classList.remove('active');
                }
            }
        });
    });

    // Sidebar Toggle Logic
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const body = document.body;

    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    body.appendChild(overlay);

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('active');
        });
    }

    // Close sidebar when clicking overlay
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        }
    });
});
