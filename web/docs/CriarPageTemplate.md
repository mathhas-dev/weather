# Criar Page Template

Uma page template é um componente comum que recebe o conteúdo da página em seu 'props.child'. Seu papel é criar menus, breadcrumbs, painéis laterais, footers... É de sua obrigação prover a navegação e a responsividade da página, de modo a poupar o desenvolvedor das páginas específicas de preocupações relacionadas ao design.

Page templates têm total liberdade para determinar a aparência e estrutura da página. Podem exigir que configurações específicas sejam providas (na forma de atributos) e podem repassar propriedades únicas à seu conteúdo (as páginas). Dessa forma, é essencial que cada page template possua sua própria documentação.

É impróvavel que o sistema venha a precisar de mais de 2 ou 3 páginas template. Elas devem ser colocadas em 'src/pageTemplates'.