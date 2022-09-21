const {
    client, 
    updateUser,
    createUser,
    getAllUsers,
    getUserById,
    createPost,
    updatePost,
    getAllPosts,
    getAllTags,
    getPostsByTagName
} = require('./index');

const dropTables = async () => {
    try {
        console.log("STARTING TO DROP TABLES...");

        await client.query(`
        DROP TABLE IF EXISTS post_tags;
        DROP TABLE IF EXISTS tags;
        DROP TABLE IF EXISTS posts;
            DROP TABLE IF EXISTS users;
            `);
            console.log("FINISHED DROPPING TABLES!")
        }   catch (error) {
            console.log("ERROR DROPPING TABLES!")
            throw error;
        }
    }


    const createTables = async() => {
        try {
            console.log("STARTING TO BUILD TABLES...");

            await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username varchar(255) UNIQUE NOT NULL,
                password varchar(255) NOT NULL,
                name varchar(255) NOT NULL,
                location varchar(255) NOT NULL,
                active boolean DEFAULT true
              );
        
              CREATE TABLE posts (
                id SERIAL PRIMARY KEY,
                "authorId" INTEGER REFERENCES users(id),
                title varchar(255) NOT NULL,
                content TEXT NOT NULL,
                active BOOLEAN DEFAULT true
              );
        
              CREATE TABLE tags (
                id SERIAL PRIMARY KEY,
                name varchar(255) UNIQUE NOT NULL
              );
        
              CREATE TABLE post_tags (
                "postId" INTEGER REFERENCES posts(id),
                "tagId" INTEGER REFERENCES tags(id),
                UNIQUE ("postId", "tagId")
              );
            `);
        
        console.log("FINISHED BUILDING TABLES!");
    }   catch (error) {
        console.log("ERROR BUILDING TABLES!");
        throw error;
    }
}


const createInitialUsers = async () => {
    try {
        console.log("STARTING TO CREATE USERS...");

        const albert = await createUser({username:'albert', password: 'bertie99', name:'Al Bert', location:'Sidney, Australia'});
        const sandra = await createUser({username: 'sandra', password: '2sandy4me', name:'Just Sandra', location:"'Ain't tellin'"});
        const glamagal= await createUser({username: 'glamgal', password: 'soglam', name: 'Joshua', location: 'Upper East Side'});

    
        console.log("FINISHED CREATING USERS!");
    }   catch(error) {
        console.error("ERROR CREATING USERS!");
        throw error;
    }
}


const createInitialPosts = async() => {
    try {
        const [albert, sandra, glamgal] = await getAllUsers();
    
        console.log("STARTING TO CREATE POSTS...");
        await createPost({
          authorId: albert.id,
          title: "First Post",
          content: "This is my first post. I hope I love writing blogs as much as I love writing them.",
          tags: ["#happy", "#youcandoanything"]
        });
           
        await createPost({
            authorId: sandra.id,
            title: "How does this work?",
            content: "Seriously, does this even do anything?",
            tags: ["#happy", "#worst-day-ever"]
          });
      
          await createPost({
            authorId: glamgal.id,
            title: "Living the Glam Life",
            content: "Do you even? I swear that half of you are posing.",
            tags: ["#happy", "#youcandoanything", "#canmandoeverything"]
          });
          console.log("Finished creating posts!");
        } catch (error) {
          console.log("Error creating posts!");
          throw error;
        }
      }


const rebuildDB = async() => {
    try {
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
        await createInitialPosts();
    }   catch (error) {
        console.log("ERROR DURING REBUILDDB")
        throw error;   
    }   
        
}


const testDB = async() => {
    try {
        console.log("STARTING TO TEST DATABASE...");

        console.log("CALLING getAllUsers")       
        const users = await getAllUsers();
        console.log("Result:", users);

        console.log("Calling updateUser on users[0]")
        const updateUserResult = await updateUser(users[0].id, {
            name: "Newname Sogood",
            location: "Lesterville, KY"
        });
        console.log("Result:", updateUserResult);

        console.log("Calling getAllPosts");
        const posts = await getAllPosts();
        console.log("Result:", posts);

        console.log("Calling updatePost on posts[0]");
        const updatePostResult = await updatePost(posts[0].id, {
            title: "New Title",
            content: "Updated Content"
        });
        console.log("Result:", updatePostResult);

        console.log("Calling updatePost on posts[1], only updating tags");
        const updatePostTagsResult = await updatePost(posts[1].id, {
          tags: ["#youcandoanything", "#redfish", "#bluefish"]
        });
        console.log("Result:", updatePostTagsResult);
    
        console.log("Calling getUserById with 1");
        const albert = await getUserById(1);
        console.log("Result:", albert);
    
        console.log("Calling getAllTags");
        const allTags = await getAllTags();
        console.log("Result:", allTags);
    
        console.log("Calling getPostsByTagName with #happy");
        const postsWithHappy = await getPostsByTagName("#happy");
        console.log("Result:", postsWithHappy);
    
        console.log("Finished database tests!");
      } catch (error) {
        console.log("Error during testDB");
        throw error;
      }
    }
    


rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());
