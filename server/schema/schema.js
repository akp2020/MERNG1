const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
	GraphQLInt,
	GraphQLList
} = graphql;
const _ = require('lodash');
const Book = require("../model/book");
const Author = require("../model/author");

//dummy data
/*const books = [{
        id: 1,
        name: "book1",
        genre: "classic",
		authorId: "11"
    }, {
        id: 3,
        name: "book322",
        genre: "music",
		authorId: "21"
    }, {
        id: 2,
        name: "book233",
        genre: "movie",
		authorId: "33"
    }, {
        id: 4,
        name: "book422",
        genre: "music",
		authorId: "21"
    }, {
        id: 5,
        name: "book533",
        genre: "movie",
		authorId: "33"
    }
]

const authors = [{
        name: "n1",
        age: 23,
        id: "11"
    }, {
        name: "n11",
        age: 24,
        id: "21"
    }, {
        name: "n13",
        age: 22,
        id: "33"
    }
]*/

const AuthorType = new GraphQLObjectType({
        name: 'Author',
        fields: () => ({
            id: {
                type: GraphQLID
            },
            name: {
                type: GraphQLString
            },
            age: {
                type: GraphQLInt
            },
			books:{
				type: new GraphQLList(BookType),
				resolve(parent, args){
					//return _.filter(books, {authorId: parent.id});
					return Book.find({authorId: parent.id});
				}
			}
        })
    });

const BookType = new GraphQLObjectType({
        name: 'Book',
        fields: () => ({
            id: {
                type: GraphQLID
            },
            name: {
                type: GraphQLString
            },
            genre: {
                type: GraphQLString
            },
			author:{
				type: AuthorType,
				resolve(parent, args){
					//return _.find(authors, {id: parent.authorId});
					return Author.findById({id: parent.authorId});
				}
			}
        })
    });
	
const Mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		addAuthor: {
			type: AuthorType,
			args: {
				name: {type: GraphQLString},
				age: {type: GraphQLInt}
			},
			resolve(parent, args){
				let author = new Author({
					name: args.name,
					age: args.age
				});
				
				author.save()
				.then((resp) => {
					console.log('hhooo123 '+ resp);
					return resp;
				});
			}
		},
		addBook: {
            type: BookType,
            args: {
                name: { type: GraphQLString },
                genre: { type: GraphQLString },
                authorId: { type: GraphQLID }
            },
            resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
				console.log('bookkkk '+ book);
                return book.save();
            }
        }
	}
});	

const RootQuery = new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
            book: {
                type: BookType,
                args: {
                    id: {
                        type: GraphQLID
                    }
                },
                resolve(parent, args) {
                    // code to get data from db
                    return Book.findById(args.id);
                }
            },
			author: {
                type: AuthorType,
                args: {
                    id: {
                        type: GraphQLID
                    }
                },
                resolve(parent, args) {
                    // code to get data from db
                    return Author.findById(args.id);
                }
            },
			books: {
				type: new GraphQLList(BookType),
				resolve(parent, args){
					try{
					const mbs = Book.find({});console.log(mbs);
					}catch(e){
						console.log('err '+e);
					}
				}
			},
			authors: {
				type: new GraphQLList(AuthorType),
				resolve(parent, args){
					Author.find({}, (err, auths) => {console.log(auths);
						//return auths;
					});
				}
			}
        }
    });

module.exports = new GraphQLSchema({
        query: RootQuery,
		mutation: Mutation
    });
