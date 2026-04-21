import React, { createContext, useState, useContext, ReactNode } from 'react';
import pt from './locales/pt.json';
import en from './locales/en.json';

const fallbackTranslations: any = {
  pt: {
    nav: {
      home: 'Inicio',
      about: 'Sobre',
      services: 'Servicos',
      gallery: 'Galeria',
      contact: 'Contacto',
      bookNow: 'Marcar agora',
      admin: 'Admin'
    },
    common: {
      beforeAfter: 'Antes / Depois',
      back: 'Voltar',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      loading: 'A carregar...',
      error: 'Erro ao processar. Tenta novamente'
    },
    hero: {
      headline: 'Cuidar de ti ficou mais simples em Lichinga',
      subheadline: 'Na Serena Glow, encontras serviços de beleza com qualidade, atendimento organizado e um ambiente tranquilo.\n\nAgora já podes marcar o teu horário de forma rápida, sem complicações.',
      primaryBtn: 'Marcar Agora',
      secondaryBtn: 'Ver Serviços'
    },
    stats: {
      clients: 'Clientes satisfeitas',
      treatments: 'Tratamentos',
      specialists: 'Especialistas',
      rating: 'Avaliacao'
    },
    servicesPreview: {
      title: 'O que fazemos por ti',
      learnMore: 'Saber mais'
    },
    services: {
      title: 'Os nossos servicos',
      intro: 'Cuidamos de tudo num só lugar:',
      book: 'Reservar servico',
      categories: {
        all: 'Todos',
        hair: 'Cabelo',
        nails: 'Unhas',
        face: 'Rosto',
        relaxation: 'Relaxamento',
        facial: 'Facial',
        makeup: 'Maquilhagem',
        eyebrows: 'Sobrancelhas'
      },
      hair: {
        title: 'Cabelo',
        desc: 'Cortes, lavagem, tratamento e finalização conforme o teu estilo e tipo de cabelo.'
      },
      nails: {
        title: 'Unhas',
        desc: 'Manicure e pedicure com acabamento limpo, duradouro e bem cuidado.'
      },
      face: {
        title: 'Rosto',
        desc: 'Limpeza facial e cuidados básicos para manter a pele saudável.'
      },
      makeup: {
        title: 'Maquilhagem',
        desc: 'Maquilhagem para eventos ou uso diário, com resultado natural.'
      },
      eyebrows: {
        title: 'Pestanas e Sobrancelhas',
        desc: 'Definição e organização para valorizar o teu olhar.'
      },
      relaxation: {
        title: 'Relaxamento',
        desc: 'Massagens simples para aliviar o stress.'
      },
      depilation: {
        title: 'Depilação',
        desc: 'Serviço feito com higiene, cuidado e atenção ao conforto.'
      }
    },
    team: {
      title: 'A nossa equipa',
      members: [
        {
          name: 'Serena Glow',
          role: 'Beauty Specialist',
          desc: 'Atendimento dedicado, cuidadoso e feito ao seu ritmo.',
          img: '/images/gallery_ai_interior.png'
        },
        {
          name: 'Equipe Serena',
          role: 'Estetica e beleza',
          desc: 'Profissionais preparadas para cuidar de cada detalhe.',
          img: '/images/about_story.png'
        }
      ]
    },
    galleryPreview: {
      title: 'Momentos Serena Glow',
      viewAll: 'Ver galeria'
    },
    gallery: {
      title: 'Galeria',
      intro: 'Aqui podes ver alguns dos trabalhos feitos no salão.\n\nResultados reais, feitos com atenção e cuidado em cada detalhe.',
      all: 'Todos'
    },
    galleryPage: {
      categories: ['Todos', 'Estudio', 'Facial', 'Unhas', 'Maquilhagem', 'Cabelo', 'Sobrancelhas'],
      resultsTitle: 'Resultados reais',
      resultsDesc: 'Pequenos cuidados que fazem diferenca no seu dia.'
    },
    testimonials: {
      title: 'O que dizem as clientes',
      subtitle: 'Experiencias partilhadas por quem ja viveu o cuidado Serena Glow.',
      list: [
        {
          name: 'Cliente Serena',
          text: 'Gostei muito do atendimento.',
          img: '/images/gallery_ai_facial.png'
        },
        {
          name: 'Maria',
          text: 'Voltarei mais vezes.',
          img: '/images/gallery_ai_nails.png'
        },
        {
          name: 'Ana',
          text: 'Vale mesmo a pena.',
          img: '/images/gallery_ai_makeup.png'
        }
      ]
    },
    pricing: {
      title: 'Pacotes especiais',
      mostPopular: 'Mais escolhido',
      book: 'Reservar',
      packages: [
        {
          name: 'Glow Essencial',
          price: '1.500 MZN',
          features: ['Consulta inicial', 'Cuidado personalizado', 'Finalizacao delicada']
        },
        {
          name: 'Beauty Day',
          price: '3.500 MZN',
          popular: true,
          features: ['Manicure', 'Pedicure', 'Design suave']
        },
        {
          name: 'Serena Premium',
          price: '5.000 MZN',
          features: ['Facial completo', 'Maquilhagem leve', 'Acompanhamento especial']
        }
      ]
    },
    faq: {
      title: 'Perguntas frequentes',
      list: [
        {
          q: 'Como faço a marcação?',
          a: 'Podes marcar online ou entrar em contacto connosco.'
        },
        {
          q: 'Posso escolher o servico no dia?',
          a: 'Sim, a equipa pode ajudar a escolher o melhor cuidado.'
        },
        {
          q: 'Onde fica o salao?',
          a: 'A Serena Glow atende em Lichinga, Niassa.'
        }
      ]
    },
    cta: {
      headline: 'Faz a tua marcação em poucos passos:\n\n* Escolhe o serviço\n* Selecciona a data\n* Define a hora\n\nSimples, rápido e organizado.',
      book: 'Marcar agora',
      contact: 'Contactar'
    },
    footer: {
      description: 'Serena Glow e um espaco de beleza e bem-estar pensado para realcar a sua beleza natural.',
      descriptionDesktop: 'Serena Glow e um espaco de beleza e bem-estar em Lichinga, pensado para realcar a sua beleza natural com cuidado, elegancia e atencao aos detalhes.',
      quickLinks: 'Links rapidos',
      services: 'Servicos',
      serviceLinks: ['Facial', 'Manicure', 'Pedicure', 'Maquilhagem', 'Sobrancelhas'],
      contactInfo: 'Contacto',
      address: 'Lichinga, Niassa',
      phone: '+258 84 123 4567',
      email: 'contacto@serenaglow.co.mz',
      copyright: 'Copyright {year} Serena Glow. Todos os direitos reservados.',
      privacy: 'Privacidade',
      terms: 'Termos'
    },
    about: {
      title: 'Sobre a Serena Glow',
      mission: 'A Serena Glow | Beauty Salon é um salão feminino localizado em Lichinga, criado para atender mulheres que procuram um serviço de beleza cuidado, organizado e de confiança.\n\nTrabalhamos com atenção ao detalhe, respeito pela cliente e foco em resultados consistentes.\n\nO nosso espaço foi pensado para oferecer conforto, privacidade e um atendimento profissional do início ao fim.',
      values: {
        title: 'Os nossos valores',
        list: [
          {
            title: 'Cuidado',
            desc: 'Tratamos cada cliente com respeito, calma e atencao.'
          },
          {
            title: 'Qualidade',
            desc: 'Usamos tecnicas e produtos escolhidos com criterio.'
          },
          {
            title: 'Confianca',
            desc: 'Criamos um ambiente seguro para cuidar de si.'
          }
        ]
      }
    },
    contact: {
      title: 'Fale connosco',
      intro: 'Lichinga, Niassa, Moçambique\n+258 XXX XXX XXX\ngeral@serenaglow.co.mz\n\nTambém podes fazer a tua marcação online de forma simples.',
      infoTitle: 'Informacoes de contacto',
      address: 'Endereco',
      addressValue: 'Lichinga, Niassa',
      phone: 'Telefone',
      phoneValue: '+258 84 123 4567',
      email: 'Email',
      emailValue: 'contacto@serenaglow.co.mz',
      hours: 'Horario',
      hoursValue: 'Segunda a Sabado\n08:00 - 18:00',
      mapPlaceholder: 'Mapa Serena Glow',
      formTitle: 'Envie uma mensagem',
      success: 'Mensagem enviada com sucesso',
      booking_button: 'Marcar Agora',
      form: {
        name: 'Nome',
        phone: 'Telefone',
        email: 'Email',
        message: 'Mensagem',
        send: 'Enviar mensagem'
      }
    },
    booking: {
      title: 'Marcar atendimento',
      name: 'Nome',
      namePlaceholder: 'O seu nome',
      phone: 'Telefone',
      phonePlaceholder: '+258...',
      email: 'Email',
      emailPlaceholder: 'email@exemplo.com',
      service: 'Servico',
      selectService: 'Escolha um servico',
      date: 'Data',
      selectDate: 'Escolha a data',
      time: 'Hora',
      selectTime: 'Escolha a hora',
      notes: 'Notas',
      notesPlaceholder: 'Preferencias ou observacoes',
      confirm: 'Confirmar marcacao',
      success: 'Marcacao enviada com sucesso',
      error: 'Erro ao realizar marcacao',
      services: []
    },
    privacyPolicy: {
      title: 'Politica de Privacidade',
      intro: 'Saiba como protegemos as informacoes partilhadas connosco.',
      nav: {
        back: 'Voltar ao inicio',
        next: 'Ver termos'
      },
      sections: [
        {
          title: 'Dados recolhidos',
          content: 'Recolhemos apenas dados necessarios para contacto, marcacoes e atendimento.'
        },
        {
          title: 'Uso das informacoes',
          content: 'As informacoes sao usadas para gerir reservas, responder mensagens e melhorar o atendimento.'
        }
      ]
    },
    termsOfService: {
      title: 'Termos de Servico',
      intro: 'Conheca as condicoes gerais de atendimento da Serena Glow.',
      nav: {
        back: 'Ver privacidade',
        next: 'Voltar ao inicio'
      },
      sections: [
        {
          title: 'Marcacoes',
          content: 'As marcacoes dependem de disponibilidade e podem necessitar de confirmacao.'
        },
        {
          title: 'Cancelamentos',
          content: 'Pedimos que avise com antecedencia caso precise reagendar.'
        }
      ]
    },
    admin: {
      welcomeBack: 'Bem-vinda de volta, Serena!',
      seeYouSoon: 'Ate breve!',
      back: 'Voltar',
      checkoutSuccess: 'Venda finalizada com sucesso',
      marketing: 'Marketing',
      selectMessage: 'Selecione uma mensagem',
      login: {
        title: 'SERENA GLOW',
        subtitle: 'Sistema de gestao de salao',
        section: 'Aceder ao painel',
        aux: 'Introduza os seus dados',
        email: {
          label: 'Email',
          placeholder: 'Email de acesso'
        },
        password: {
          label: 'Palavra-passe',
          placeholder: 'Palavra-passe'
        },
        recovery: {
          link: 'Recuperar acesso',
          title: 'Recuperar palavra-passe',
          description: 'Informe o email para receber instrucoes.',
          confirmation: 'Enviamos as instrucoes de recuperacao.',
          button: 'Enviar ligacao'
        },
        button: 'Entrar',
        error: 'Email ou palavra-passe incorrectos'
      },
      sidebar: {
        brand: 'Serena Glow',
        tagline: 'Gestão do salão',
        dashboard: 'Dashboard',
        agenda: 'Agenda',
        sales: 'Pagamentos',
        reports: 'Relatórios',
        clients: 'Clientes',
        services: 'Serviços',
        marketing: 'Marketing',
        gallery: 'Galeria',
        settings: 'Configurações',
        logout: 'Terminar sessão',
        team: 'Equipa'
      },
      dashboard: {
        system_online: 'Sistema online',
        title: 'Dashboard',
        subtitle: 'Resumo do salão com informações principais do dia.',
        summary_title: 'Resumo da actividade recente',
        stats: {
          revenue: 'Receita',
          revenue_desc: 'Total registado no periodo',
          appointments: 'Marcacoes',
          appointments_desc: 'Atendimentos registados',
          customers: 'Clientes',
          cust_desc: 'Clientes activos',
          conversion: 'Conversao',
          conv_desc: 'Taxa media de retorno'
        },
        indicators: {
          next_appt: 'Proximo atendimento em breve',
          agenda_full: 'Agenda quase completa',
          no_pending: 'Sem pendentes no momento'
        },
        cards: {
          today_appts: 'Marcacoes de hoje',
          empty_appts: 'Sem marcacoes',
          messages: 'Mensagens',
          empty_messages: 'Sem mensagens novas',
          billing: 'Faturacao',
          empty_billing: 'Sem pendentes'
        },
        performance: {
          subtitle: 'Desempenho do salao',
          activity: 'Actividade por periodo',
          tabs: {
            general: 'Geral',
            services: 'Servicos'
          }
        },
        popular_services: {
          title: 'Servicos populares',
          subtitle: 'Preferencias das clientes',
          desc: 'Distribuicao dos servicos mais procurados'
        },
        activity: {
          title: 'Actividade recente',
          empty: 'Sem actividade recente',
          button: 'Ver relatorios',
          new_booking: 'Nova marcacao criada',
          service_updated: 'Servico actualizado',
          client_added: 'Cliente adicionado'
        },
        summary: {
          title: 'Resumo rapido',
          subtitle: 'Atalhos de gestao',
          view_team: 'Ver equipa',
          manage_agenda: 'Gerir agenda'
        }
      },
      ui: {
        buttons: {
          view_agenda: 'Ver agenda',
          create_booking: 'Criar marcacao',
          save_changes: 'Guardar',
          add_client: 'Adicionar cliente',
          edit: 'Editar',
          remove: 'Remover',
          cancel: 'Cancelar',
          confirm: 'Confirmar',
          add_service: 'Adicionar servico',
          add_campaign: 'Nova campanha',
          finish_sale: 'Finalizar venda',
          upload_photo: 'Carregar fotografia',
          add_professional: 'Adicionar profissional',
          download_pdf: 'Descarregar PDF',
          close: 'Fechar',
          preview: 'Visualizar',
          send_email: 'Enviar por email'
        },
        feedback: {
          saved: 'Guardado com sucesso',
          updated: 'Alteracoes actualizadas',
          removed: 'Removido com sucesso',
          generated: 'Conteudo gerado',
          error: 'Erro ao processar. Tente novamente'
        },
        empty: {
          bookings: 'Sem marcacoes. Crie uma nova para comecar.',
          clients: 'Nenhum cliente registado.',
          team: 'Nenhuma profissional registada.',
          services: 'Nenhum servico disponivel.',
          services_helper: 'Adicione servicos para construir o catalogo.',
          activity: 'Sem actividade registada hoje.',
          campaigns: 'Nenhuma campanha activa.',
          photos: 'Nenhuma fotografia na galeria.'
        },
        emptyStates: {
          notifications: 'Escolha uma mensagem para ver os detalhes.'
        },
        confirm: {
          delete_title: 'Tem a certeza que quer remover?',
          delete_desc: 'Esta accao nao pode ser desfeita'
        },
        search: {
          placeholder: 'Pesquisar...',
          filter: 'Filtrar por'
        },
        status: {
          active: 'Activo',
          inactive: 'Inactivo',
          confirmed: 'Confirmado',
          cancelled: 'Cancelado',
          completed: 'Concluido'
        },
        dashboard: {
          charts: {
            studio_full: 'Ocupacao do estudio'
          }
        },
        agenda: {
          title: 'Agenda',
          auxiliary: 'Controlo de todas as marcações num só lugar.',
          loading: 'A carregar agenda',
          toast: {
            load_error: 'Erro ao carregar agenda'
          }
        },
        services: {
          title: 'Serviços',
          description: 'Gestão de serviços, preços e duração.',
          auxiliary: 'Preços, duração e categorias',
          search: 'Pesquisar serviços',
          toast: {
            load_error: 'Erro ao carregar servicos',
            update_success: 'Servico actualizado',
            delete_success: 'Servico removido',
            delete_error: 'Erro ao remover servico'
          }
        },
        clients: {
          title: 'Clientes',
          description: 'Lista de clientes com contactos e histórico de serviços.',
          auxiliary: 'Contactos e histórico de serviços',
          no_phone: 'Telefone nao registado',
          prompt_name: 'Nome da cliente',
          prompt_phone: 'Telefone da cliente',
          toast: {
            add_success: 'Cliente adicionada',
            add_error: 'Erro ao adicionar cliente'
          }
        },
        sales: {
          title: 'Vendas',
          description: 'Ponto de venda do salao',
          loading: 'A preparar vendas',
          walk_in: 'Venda de balcao',
          toast: {
            sale_error: 'Erro ao finalizar venda',
            staff_assigned: 'Profissional atribuida'
          },
          cart: {
            title: 'Carrinho',
            add: 'adicionado ao carrinho',
            empty: 'Adicione servicos para finalizar uma venda.',
            item_singular: 'item',
            item_plural: 'itens',
            assign_staff: 'Atribuir profissional',
            subtotal: 'Subtotal',
            discount: 'Adicionar desconto',
            total: 'Total final'
          },
          payment: {
            cash: 'Dinheiro',
            'm-pesa': 'M-Pesa',
            card: 'Cartao'
          }
        },
        billing: {
          title: 'Relatórios',
          description: 'Acompanhamento de entradas e desempenho do salão.',
          auxiliary: 'Entradas e desempenho do salão',
          new: 'Novo documento',
          invoice: 'Factura',
          receipt: 'Recibo',
          empty: 'Sem documentos',
          loading: 'A carregar documentos',
          stats: {
            monthly: 'Receita mensal',
            docs: 'Documentos',
            pending: 'Pendentes'
          },
          table: {
            number: 'Numero',
            type: 'Tipo',
            client: 'Cliente',
            date: 'Data',
            total: 'Total',
            actions: 'Accoes',
            details: 'Detalhes'
          },
          pdf: {
            company: 'Serena Glow',
            subtitle: 'Beauty Studio',
            address: 'Lichinga, Niassa',
            description: 'Descricao',
            qty: 'Qtd',
            unit: 'Unitario',
            total: 'Total',
            issued_to: 'Emitido para:',
            fallback_desc: 'Servicos esteticos diversos',
            client_signature: 'Assinatura da cliente',
            company_signature: 'Assinatura Serena Glow',
            footer_legal: 'Obrigada pela preferencia.'
          },
          toast: {
            load_error: 'Erro ao carregar documentos',
            download_success: 'Documento descarregado',
            auto_billing: 'Faturacao automatica activa'
          },
          banner: {
            title: 'Relatorios financeiros',
            description: 'Use os dados para entender os momentos de maior procura.'
          }
        },
        inbox: {
          title: 'Mensagens',
          description: 'Pedidos e contactos recebidos',
          auxiliary: 'Acompanhe as conversas',
          loading: 'A carregar mensagens',
          filters: {
            all: 'Todas',
            unread: 'Nao lidas',
            read: 'Lidas',
            replied: 'Respondidas',
            archived: 'Arquivadas'
          },
          toast: {
            new_message: 'Nova mensagem',
            load_error: 'Erro ao carregar mensagens',
            archive_error: 'Erro ao arquivar mensagem',
            delete_error: 'Erro ao remover mensagem',
            reply_success: 'Resposta registada',
            reply_error: 'Erro ao responder'
          }
        },
        gallery: {
          title: 'Galeria',
          description: 'Fotografias e resultados',
          loading: 'A carregar galeria',
          modal_title: 'Adicionar imagem',
          categories: {
            general: 'Geral',
            hair: 'Cabelo',
            nails: 'Unhas',
            makeup: 'Maquilhagem',
            studio: 'Estudio'
          },
          form: {
            url: 'URL da imagem',
            category: 'Categoria',
            client: 'Cliente',
            submit: 'Guardar na galeria'
          },
          toast: {
            load_error: 'Erro ao carregar galeria',
            add_success: 'Imagem adicionada com sucesso',
            add_error: 'Erro ao adicionar imagem'
          }
        }
      },
      settings: {
        title: 'Definições',
        subtitle: 'Configuração de horários, equipa e funcionamento.',
        profile: {
          title: 'Perfil do salão',
          subtitle: 'Dados apresentados ao público',
          fields: {
            name: 'Nome',
            contact: 'Contacto',
            address: 'Endereço'
          }
        },
        team: {
          professionals: 'Profissionais',
          access_type: {
            label: 'Tipo de acesso',
            admin: 'Administrador',
            staff: 'Funcionaria',
            desc: 'Define o nivel de acesso no sistema.'
          }
        },
        system: {
          title: 'Sistema',
          subtitle: 'Idioma e notificacoes',
          fields: {
            language: 'Idioma',
            notifications: 'Notificacoes'
          }
        },
        roles: {
          title: 'Permissoes',
          desc: 'Controle os acessos da equipa ao painel.',
          new: 'Criar permissao'
        }
      }
    }
  },
  en: {}
};

const mergeDeep = (base: any, override: any): any => {
  if (Array.isArray(base) || Array.isArray(override)) {
    return override !== undefined ? override : base;
  }

  if (typeof base !== 'object' || base === null) {
    return override !== undefined ? override : base;
  }

  const merged: any = { ...base };
  for (const key of Object.keys(override || {})) {
    merged[key] = mergeDeep(base[key], override[key]);
  }
  return merged;
};

const translations: any = {
  pt: mergeDeep(pt, fallbackTranslations.pt),
  en: mergeDeep(en, fallbackTranslations.en)
};

const prettifyMissingKey = (key: string) => {
  const labels: Record<string, string> = {
    title: 'Titulo',
    subtitle: 'Subtitulo',
    description: 'Descricao',
    auxiliary: 'Detalhes',
    loading: 'A carregar',
    empty: 'Sem dados',
    new: 'Novo',
    name: 'Nome',
    phone: 'Telefone',
    email: 'Email',
    address: 'Endereco',
    total: 'Total',
    date: 'Data',
    actions: 'Accoes',
    client: 'Cliente',
    services: 'Servicos',
    agenda: 'Agenda',
    dashboard: 'Painel',
    settings: 'Configuracoes'
  };

  const lastSegment = key.split('.').pop() || key;
  if (labels[lastSegment]) return labels[lastSegment];

  return lastSegment
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'pt' || saved === 'en') ? saved : 'pt';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations[language];
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        return prettifyMissingKey(key);
      }
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
