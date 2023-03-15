function setCurrentShortcode() {
    const postRegex = /\/(p|tv|reel|reels)\/(.*?)\//
    const page = window.location.pathname.match(postRegex)
    if (page) appLog.current.shortcode = page[2]
}
async function getPostPhotos() {
    const apiURL = new URL('/graphql/query/', BASE_URL)
    apiURL.searchParams.set('query_hash', POST_HASH)
    apiURL.searchParams.set('variables', JSON.stringify({
        shortcode: appLog.current.shortcode
    }))
    try {
        const respone = await fetch(apiURL.href)
        const json = await respone.json()
        return json.data['shortcode_media']
    } catch (error) {
        console.log(error)
        return null
    }
}
async function downloadPostPhotos() {
    const data = {
        user: {
            username: '',
            fullName: '',
        },
        media: []
    }
    const json = await getPostPhotos()
    if (!json) return null
    data.user.username = json.owner['username']
    data.user.fullName = json.owner['full_name']
    if (json.hasOwnProperty('edge_sidecar_to_children')) {
        const items = json['edge_sidecar_to_children']['edges']
        items.forEach((item) => {
            if (item.node['is_video'] === true) {
                const media = {
                    url: item.node['video_url'],
                    isVideo: true
                }
                data.media.push(media)
            }
            else {
                const media = {
                    url: item.node['display_url'],
                    isVideo: false
                }
                data.media.push(media)
            }
        })
    }
    else {
        if (json['is_video'] === true) {
            const media = {
                url: json['video_url'],
                isVideo: true
            }
            data.media.push(media)
        }
        else {
            const media = {
                url: json['display_url'],
                isVideo: false
            }
            data.media.push(media)
        }
    }
    return data
}