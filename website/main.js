"use strict"

class PostComponent {
    constructor(photoUrl, profileUrl, name, designation, timestamp, description) {
        this.photoUrl = photoUrl;
        this.profileUrl = profileUrl;
        this.name = name;
        this.designation = designation;
        this.timestamp = timestamp;
        this.description = description;
        this.render("postContainer");
    }

    render(containerId) {
        const container = document.getElementById(containerId);

        const postDiv = document.createElement('div');
        postDiv.className = 'card mt-2';
        postDiv.innerHTML = `
            <div class="card container bg-white border-0 d-flex">
                <div class="row p-2">
                    <div class="col-2">
                      <img src="${this.photoUrl}" class="postphoto img-profile" style="width: 60px; height: 60px; margin-right: 14px;">
                    </div>
                    <div class="col-9 justify-content-start p-0">
                        <span class="posttext d-flex align-items-top">
                            <a href="${this.profileUrl}" target="_blank" style="color: #212529;">${this.name}</a>
                        </span>
                        <span class="posttext d-flex align-items-middle" style="font-family: Arial, sans-serif; font-size: 11px; color: #474747;">${this.designation}</span>
                        <span class="posttext d-flex align-items-bottom" style="font-family: Arial, sans-serif; font-size: 11px; color: #474747;">${this.timestamp}  <i class="fas fa-globe-americas fa-sm ml-1"></i></span>
                    </div>
                    <div class="co-1 float-right">
                    </div>
                </div>
            </div>
            <div>
                <p class="card-text ml-3" style="font-family: Arial, sans-serif; font-size: 15px; color: black;">${this.description}</p>
                <div class="card-footer bg-white mt-1">
                    <span><button class="ref btn-light border-0"><i class="far fa-thumbs-up fa-md" style="font-size: 1.2rem"><span class="ml-2 mediatext">Like</span></i></button></span>
                    <span><button class="ref btn-light border-0"><i class="fas fa-share fa-md" style="font-size: 1.2rem"><span class="ml-2 mediatext">Share</span></i></button></span>
                </div>
            </div>
        `;

        container.appendChild(postDiv);
    }
}




let userPosts = [
    {
        photoUrl: 'https://pbs.twimg.com/profile_images/1363521426574241797/QI2kSWz6_400x400.jpg',
        profileUrl: 'https://www.linkedin.com/in/malan/',
        name: 'David J. Malan',
        designation: 'I teach CS50',
        timestamp: '25a',
        description: 'They have done great things! Tebrikler Kodluyoruz!'
    },
    {
        photoUrl: 'https://i.seadn.io/gae/eMQWSb9NyPpFZoTeE8nFqgdWPEAfrmAivEFgbiKAvkYhUNqRTwa5ofZspMG0qJVBajgIqiwTm9FnWQ0ZdVVaZ04j5Dp12NcSzSM7iw?auto=format&dpr=1&w=1000',
        profileUrl: 'https://www.linkedin.com/in/johndoe/',
        name: 'John Doe',
        designation: 'Software Engineer',
        timestamp: '2h',
        description: 'Excited to share my latest project! #codinglife'
    },
    {
        photoUrl: 'https://i.seadn.io/gae/eMQWSb9NyPpFZoTeE8nFqgdWPEAfrmAivEFgbiKAvkYhUNqRTwa5ofZspMG0qJVBajgIqiwTm9FnWQ0ZdVVaZ04j5Dp12NcSzSM7iw?auto=format&dpr=1&w=1000',
        profileUrl: 'https://www.linkedin.com/in/johndoe/',
        name: 'John Doe',
        designation: 'Software Engineer',
        timestamp: '2h',
        description: 'Excited to share my latest project! #codinglife'
    },
    {
        photoUrl: 'https://i.seadn.io/gae/eMQWSb9NyPpFZoTeE8nFqgdWPEAfrmAivEFgbiKAvkYhUNqRTwa5ofZspMG0qJVBajgIqiwTm9FnWQ0ZdVVaZ04j5Dp12NcSzSM7iw?auto=format&dpr=1&w=1000',
        profileUrl: 'https://www.linkedin.com/in/johndoe/',
        name: 'John Doe',
        designation: 'Software Engineer',
        timestamp: '2h',
        description: 'Excited to share my latest project! #codinglife'
    },
    // Add more user posts as needed
];

userPosts.forEach(post => new PostComponent(post.photoUrl, post.profileUrl, post.name, post.designation, post.timestamp, post.description));
