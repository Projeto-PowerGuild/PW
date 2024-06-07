class Platform {
    constructor(name) {
        this.name = name;
    }
}

class PlatformManager {
    static fetchPlatforms() {
        return new Promise((resolve) => {
            const platformsJson = [
                { name: 'Ps5' },
                { name: 'Ps4' },
                { name: 'Xbox One' },
                { name: 'Xbox Series S' },
                { name: 'PC' },
                { name: 'Nintendo Switch' }
            ];
            resolve(platformsJson);
        }).then(data => {
            return data.map(platform => new Platform(platform.name));
        }).catch(error => {
            console.error('Error fetching the platforms:', error);
            return [];
        });
    }

    static displayPlatforms(platforms) {
        const platformList = document.getElementById('platformList');

        platforms.forEach(platform => {
            const platformDiv = document.createElement('div');
            platformDiv.className = 'platform';

            const platformName = document.createElement('h2');
            platformName.textContent = platform.name;

            platformDiv.appendChild(platformName);
            platformList.appendChild(platformDiv);
        });
    }
}

// Exemplo de uso
PlatformManager.fetchPlatforms().then(platforms => {
    PlatformManager.displayPlatforms(platforms);
});
