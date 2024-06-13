        document.querySelector('.menu-button').addEventListener('click', function() {
            const dropdown = document.getElementById('dropdown');
            dropdown.classList.toggle('show');

        
            const menuIcon = document.querySelector('.menu-icon');
            if (dropdown.classList.contains('show')) {
                menuIcon.textContent = 'close'; 
            } else {
                menuIcon.textContent = 'menu'; 
            }
        });

        document.getElementById('theme-toggle').addEventListener('change', function() {
            document.documentElement.setAttribute('data-theme', this.checked ? 'dark' : 'light');
        });


        window.addEventListener('click', function(event) {
            const dropdown = document.getElementById('dropdown');
            if (!event.target.matches('.menu-button') && !dropdown.contains(event.target)) {
                dropdown.classList.remove('show');
                document.querySelector('.menu-icon').textContent = 'menu';
            }
        });