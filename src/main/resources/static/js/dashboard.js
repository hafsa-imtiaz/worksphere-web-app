const ctx = document.getElementById('myChart').getContext('2d');
new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [{
            label: 'Income',
            data: [10, 30, 20, 50, 40, 60, 30],
            borderColor: '#1D38C1',
            borderWidth: 2,
            fill: true,
            backgroundColor: 'rgba(5, 13, 252, 0.29)'
        }]
    },
    options: {
        responsive: true
    }
});
