let staffMembers = [];

async function getDiscordAvatar(discordId) {
    try {
        const response = await fetch(`https://japi.rest/discord/v1/user/${discordId}`);
        if (response.ok) {
            const data = await response.json();
            if (data.data && data.data.avatar) {
                return `https://cdn.discordapp.com/avatars/${discordId}/${data.data. avatar}.png? size=2048`;
            }
        }
    } catch (error) {
        console.log('Error:', error);
    }
    return null;
}

async function loadStaffData() {
    try {
        const response = await fetch('staff-data.json');
        const data = await response.json();
        
        staffMembers = await Promise.all(data.staffMembers.map(async (member) => {
            const image = await getDiscordAvatar(member.discordId);
            return {
                ...member,
                link: `https://discord.com/users/${member.discordId}`,
                image:  image || 'https://via.placeholder.com/120'
            };
        }));
        
        renderStaff();
    } catch (error) {
        console.error('Error:', error);
    }
}

function renderStaff() {
    const grid = document.getElementById('staffGrid');
    grid.innerHTML = '';

    staffMembers.forEach((member, index) => {
        const card = document.createElement('div');
        card.className = 'staff-card';
        card. style.animationDelay = (index * 0.1) + 's';
        card.innerHTML = `
            <a href="${member.link}" target="_blank">
                <img src="${member. image}" alt="${member.name}" class="staff-avatar">
            </a>
            <div class="staff-name">${member.name}</div>
            <div class="staff-role">${member.role}</div>
        `;
        grid.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target. scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    document.querySelector('.btn-primary').addEventListener('click', function() {
        window.open('https://discord.com/invite/S8v2gaDPKX', '_blank');
    });

    document.querySelector('.btn-secondary').addEventListener('click', function() {
        window.open('https://disboard.org/es/server/1429159416493637804', '_blank');
    });

    loadStaffData();
});

window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    document.querySelectorAll('.logo-large').forEach(el => {
        el.style.transform = `translateY(${scrolled * 0.5}px) rotateZ(${scrolled * 0.1}deg)`;
    });
});