function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function getFileNameFromSrc(src) {
    const urlParts = src.split('/');
    return urlParts[urlParts.length - 1];
}

function createCustomContextMenu(selectedElement, picture) {
    let existingMenu = document.getElementById('custom-context-menu');
    if (existingMenu) {
        existingMenu.remove();
    }

    const menu = document.createElement('div');
    menu.id = 'custom-context-menu';
    menu.style.position = 'absolute';
    menu.style.background = '#ffffff';
    menu.style.border = '1px solid #ccc';
    menu.style.padding = '10px';
    menu.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    menu.style.zIndex = '10000';

    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download';
    downloadButton.style.cursor = 'pointer';

    downloadButton.addEventListener('click', function () {
        const videoSrc = picture ? selectedElement.srcset.split(' ')[0].replace('=300', "=1200") : selectedElement.src;

        if (videoSrc) {
            const fileName = getFileNameFromSrc(videoSrc);

            fetch(videoSrc, {
                headers: {
                    'Referer': window.location.href
                }
            })
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.error('Download failed:', error);
            });
        }
    });

    menu.appendChild(downloadButton);

    document.body.appendChild(menu);

    document.addEventListener('contextmenu', function (event) {
        event.preventDefault();
        menu.style.left = `${event.pageX}px`;
        menu.style.top = `${event.pageY}px`;
    });

    document.addEventListener('click', function () {
        menu.remove();
    });
}

function modifyVideoElement() {
    let videoElement = getElementByXpath(`//div[contains(@class, 'swiper-slide-active')]/div/div[1]/video`);
    const divElement = getElementByXpath(`//div[contains(@class, 'swiper-slide-active')]/div/div[1]/video/../../div[4]`) || getElementByXpath(`//div[contains(@class, 'swiper-slide-active')]/div/div[1]/video/../../div[3]`);

    if (videoElement && divElement) {
        let picture = false
        if (videoElement.getAttribute('src') == "") {
            videoElement = getElementByXpath(`//div[contains(@class, 'swiper-slide-active')]/div/div[1]/div/picture/source`);
            picture = true
        }
        divElement.addEventListener('contextmenu', function (event) {
            event.preventDefault();
            createCustomContextMenu(videoElement, picture);
        });
    }
}

modifyVideoElement();

document.addEventListener('DOMContentLoaded', modifyVideoElement);

setInterval(modifyVideoElement, 200);
