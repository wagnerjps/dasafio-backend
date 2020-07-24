
exports.up = function(knex) {
    return knex.schema.createTable('tools', function (table){
        table.increments().primary();
        
        table.string('title').notNullable();
        table.string('link').notNullable();
        table.string('description').notNullable();

        });
};

exports.down = function(knex) {
    return knex.schema.dropTable('tools');
};
