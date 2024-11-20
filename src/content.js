function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function getFileNameFromSrc(src) {
    try {
        const urlParts = src.split('/');
        return urlParts[urlParts.length - 1];
    } catch (error) {
        showNotification('Error getting filename: ' + error.message, 'error');
        return 'download';
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.bottom = '-100px'; // Start below screen
    notification.style.right = '20px';
    notification.style.background = 'rgba(32, 33, 36, 0.85)';
    notification.style.backdropFilter = 'blur(16px)';
    notification.style.padding = '16px 24px';
    notification.style.borderRadius = '12px';
    notification.style.color = '#ffffff';
    notification.style.fontSize = '14px';
    notification.style.fontFamily = 'Arial, sans-serif';
    notification.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';
    notification.style.zIndex = '10001';
    notification.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '12px';
    notification.style.opacity = '0';
    notification.style.transform = 'scale(0.8)';
    
    const icon = document.createElement('span');
    if (type === 'success') {
        icon.textContent = '✓';
        icon.style.color = '#4CAF50';
    } else if (type === 'error') {
        icon.textContent = '✕';
        icon.style.color = '#f44336';
    } else {
        icon.textContent = 'ℹ';
        icon.style.color = '#2196F3';
    }
    icon.style.fontSize = '20px';
    icon.style.fontWeight = 'bold';
    
    const text = document.createElement('span');
    text.textContent = message;
    
    notification.appendChild(icon);
    notification.appendChild(text);
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'scale(1)';
        notification.style.bottom = '20px';
    });
    
    // Remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'scale(0.8) translateY(100px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

function addRainbowGlowEffect(selectedElement) {
    // Создаем anchor контейнер
    const anchorContainer = document.createElement('div');
    anchorContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: visible;
    `;
    selectedElement.parentElement.style.position = 'relative';
    selectedElement.parentElement.insertBefore(anchorContainer, selectedElement);
    
    // Создаем элемент свечения
    const glowElement = document.createElement('div');
    glowElement.style.cssText = `
        position: absolute;
        pointer-events: none;
        top: -30px;
        left: -30px;
        right: -30px;
        bottom: -30px;
        z-index: -1;
    `;
    
    // Создаем и добавляем стили для анимации
    const style = document.createElement('style');
    style.textContent = `
        @keyframes gradientRotate {
            0% {
                background-position: 0% 50%;
            }
            100% {
                background-position: 200% 50%;
            }
        }
        @keyframes glowFade {
            0% { opacity: 0; }
            15% { opacity: 1; }
            85% { opacity: 1; }
            100% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    glowElement.style.cssText += `
        background: linear-gradient(90deg,
            rgba(255,0,0,0.3),
            rgba(255,165,0,0.3),
            rgba(255,255,0,0.3),
            rgba(0,255,0,0.3),
            rgba(0,158,255,0.3),
            rgba(238,130,238,0.3),
            rgba(255,0,0,0.3)
        );
        background-size: 200% 100%;
        border-radius: 12px;
        filter: blur(35px);
        animation: 
            gradientRotate 4s linear infinite,
            glowFade 3s ease-in-out forwards;
    `;

    anchorContainer.appendChild(glowElement);

    // Удаляем элементы после завершения анимации
    setTimeout(() => {
        anchorContainer.remove();
        style.remove();
    }, 3000);
}

function createCustomContextMenu(selectedElement, picture) {
    try {
        let existingMenu = document.getElementById('custom-context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }

        const menu = document.createElement('div');
        menu.id = 'custom-context-menu';
        menu.style.position = 'absolute';
        menu.style.background = 'rgba(32, 33, 36, 0.85)';
        menu.style.backdropFilter = 'blur(16px)';
        menu.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        menu.style.borderRadius = '12px';
        menu.style.padding = '18px';
        menu.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';
        menu.style.zIndex = '10000';
        menu.style.minWidth = '220px';
        menu.style.fontFamily = 'Arial, sans-serif';
        menu.style.transform = 'translate(-50%, 20px)';
        menu.style.opacity = '0';
        menu.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';

        const videoSrc = picture ? selectedElement.srcset.split(' ')[0].replace('=300', "=1200") : selectedElement.src;
        if (!videoSrc) {
            throw new Error('Could not get video source');
        }
        const fileName = getFileNameFromSrc(videoSrc);

        const fileNameDiv = document.createElement('div');
        fileNameDiv.textContent = fileName;
        fileNameDiv.style.marginBottom = '15px';
        fileNameDiv.style.color = '#ffffff';
        fileNameDiv.style.fontSize = '14px';
        fileNameDiv.style.wordBreak = 'break-all';
        fileNameDiv.style.borderBottom = '1px solid rgba(255, 255, 255, 0.15)';
        fileNameDiv.style.paddingBottom = '12px';

        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download';
        downloadButton.style.cursor = 'pointer';
        downloadButton.style.width = '100%';
        downloadButton.style.padding = '12px 20px';
        downloadButton.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        downloadButton.style.color = 'white';
        downloadButton.style.border = 'none';
        downloadButton.style.borderRadius = '8px';
        downloadButton.style.fontSize = '15px';
        downloadButton.style.fontWeight = '600';
        downloadButton.style.letterSpacing = '0.5px';
        downloadButton.style.transition = 'all 0.3s ease';
        downloadButton.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';

        downloadButton.addEventListener('mouseover', function() {
            downloadButton.style.background = 'linear-gradient(135deg, #45a049, #3d8b41)';
            downloadButton.style.transform = 'translateY(-2px)';
            downloadButton.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)';
        });

        downloadButton.addEventListener('mouseout', function() {
            downloadButton.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            downloadButton.style.transform = 'translateY(0)';
            downloadButton.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
        });

        downloadButton.addEventListener('click', function () {
            if (videoSrc) {
                showNotification('Starting download...', 'info');
                const targetElement = picture ? 
                    selectedElement.parentElement.parentElement : // For picture elements
                    selectedElement; // For video elements
                addRainbowGlowEffect(targetElement);

                fetch(videoSrc, {
                    headers: {
                        'Referer': window.location.href
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.blob();
                })
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                    showNotification('Download completed successfully!', 'success');
                })
                .catch(error => {
                    console.error('Download failed:', error);
                    showNotification('Download failed: ' + error.message, 'error');
                });
            }
        });

        menu.appendChild(fileNameDiv);
        menu.appendChild(downloadButton);

        document.body.appendChild(menu);

        document.addEventListener('contextmenu', function (event) {
            event.preventDefault();
            menu.style.left = `${event.pageX}px`;
            menu.style.top = `${event.pageY}px`;
            requestAnimationFrame(() => {
                menu.style.opacity = '1';
                menu.style.transform = 'translate(-50%, 0)';
            });
        });

        document.addEventListener('click', function () {
            menu.style.opacity = '0';
            menu.style.transform = 'translate(-50%, 20px)';
            setTimeout(() => menu.remove(), 300);
        });
    } catch (error) {
        console.error('Error creating context menu:', error);
        showNotification('Error creating menu: ' + error.message, 'error');
    }
}

function modifyVideoElement() {
    try {
        let videoElement = getElementByXpath(`//div[contains(@class, 'swiper-slide-active')]/div/div[1]/video`);
        const divElement = getElementByXpath(`//div[contains(@class, 'swiper-slide-active')]/div/div[1]/video/../../div[4]`) || getElementByXpath(`//div[contains(@class, 'swiper-slide-active')]/div/div[1]/video/../../div[3]`);

        if (!divElement) {
            throw new Error('Could not find video container');
        }

        if (videoElement && divElement) {
            let picture = false;
            if (videoElement.getAttribute('src') == "") {
                videoElement = getElementByXpath(`//div[contains(@class, 'swiper-slide-active')]/div/div[1]/div/picture/source`);
                if (!videoElement) {
                    throw new Error('Could not find video source');
                }
                picture = true;
            }
            divElement.addEventListener('contextmenu', function (event) {
                event.preventDefault();
                createCustomContextMenu(videoElement, picture);
            });
        }
    } catch (error) {
        // console.error('Error modifying video element:', error);
        // showNotification('Error modifying video: ' + error.message, 'error');
    }
}

modifyVideoElement();

document.addEventListener('DOMContentLoaded', modifyVideoElement);

setInterval(modifyVideoElement, 200);
