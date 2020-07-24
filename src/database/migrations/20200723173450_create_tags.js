
exports.up = function(knex) {
    return knex.schema.createTable('tags', function (table){
        table.increments().primary();
        table.integer('tool_id').notNullable();
        table.string('name').notNullable();
        
        table.foreign('tool_id').references('id').inTable('tools').onDelete('CASCADE').onUpdate('CASCADE');
        });
};

exports.down = function(knex) {
    return knex.schema.dropTable('tags');
};
